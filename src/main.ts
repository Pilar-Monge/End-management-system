import 'reflect-metadata';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppDataSource } from './data-source';
import { runSeeder } from './seeds/seeder';
import { DecisionTreeService } from './modules/decisionTree/decisionTree.service';

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
] as const;

function resolveCorsOrigins(): string[] {
  const configuredOrigins = process.env.CORS_ORIGIN ?? process.env.CORS_ORIGINS;
  if (!configuredOrigins?.trim()) {
    return [...DEFAULT_CORS_ORIGINS];
  }

  return configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(helmet());

  app.enableCors({
    origin: resolveCorsOrigins(),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('End Management System')
      .setDescription('API for the camp management system')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste the JWT returned by POST /api/auth/login.',
      }, 'bearer')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });
  }

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  try {
    await AppDataSource.runMigrations();
    await runSeeder(AppDataSource);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const decisionTreeService = app.get(DecisionTreeService);
    const trainingJobs = [
      { filePath: 'train.json', label: 'admission' },
      { filePath: 'train-role.json', label: 'role assignment' },
    ] as const;

    const camps = (await AppDataSource.query('SELECT id FROM camp ORDER BY id')) as Array<{
      id: number;
    }>;

    for (const camp of camps) {
      for (const job of trainingJobs) {
        const result = await decisionTreeService.trainFromFileIfMissingModel(job.filePath, camp.id);

        if (result.trained) {
          logger.log(
            `AI model "${result.modelName}" trained automatically from ${job.filePath} for camp ${camp.id}`,
          );
        } else {
          logger.log(
            `AI model "${result.modelName}" already exists for camp ${camp.id}; skipping auto-training`,
          );
        }
      }
    }
  } catch (error) {
    logger.warn(
      `Could not run AI auto-training on startup: ${
        error instanceof Error ? error.message : 'unknown error'
      }`,
    );
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
