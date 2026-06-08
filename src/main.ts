import 'reflect-metadata';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';
import { runSeeder } from './seeds/seeder';
import { DecisionTreeService } from './modules/decisionTree/decisionTree.service';

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://endmgmt-app.pentadev.engineer',
  'https://www.endmgmt-app.pentadev.engineer',
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
  app.use(cookieParser());

  app.enableCors({
    origin: resolveCorsOrigins(),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Authorization', 'Set-Cookie'],
    credentials: true,
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
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste the JWT returned by POST /api/auth/login.',
        },
        'bearer',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });
  }

  const migrationDataSource = new DataSource({ ...AppDataSource.options });
  try {
    await migrationDataSource.initialize();
    await migrationDataSource.runMigrations();
    await runSeeder(migrationDataSource);
  } catch (error) {
    logger.error(
      `Migration/seeder failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  } finally {
    if (migrationDataSource.isInitialized) {
      await migrationDataSource.destroy();
    }
  }

  try {
    const decisionTreeService = app.get(DecisionTreeService);
    const nestDataSource = app.get(DataSource);

    const trainingJobs = [
      { filePath: 'train.json', label: 'admission' },
      { filePath: 'train-role.json', label: 'role assignment' },
    ] as const;

    const camps = (await nestDataSource.query('SELECT id FROM camp ORDER BY id')) as Array<{
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
      `Could not run AI auto-training on startup: ${error instanceof Error ? error.message : 'unknown error'
      }`,
    );
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
