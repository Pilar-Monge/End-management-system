import 'reflect-metadata';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppDataSource } from './data-source';
import { runSeeder } from './seeds/seeder';
import { DecisionTreeService } from './modules/decisionTree/decisionTree.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

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
    const decisionTreeService = app.get(DecisionTreeService);
    const trainingJobs = [
      { filePath: 'train.json', label: 'admission' },
      { filePath: 'train-role.json', label: 'role assignment' },
    ] as const;

    for (const job of trainingJobs) {
      const result = await decisionTreeService.trainFromFileIfMissingModel(job.filePath);

      if (result.trained) {
        logger.log(`AI model "${result.modelName}" trained automatically from ${job.filePath}`);
      } else {
        logger.log(`AI model "${result.modelName}" already exists; skipping auto-training`);
      }
    }
  } catch (error) {
    logger.warn(
      `Could not run AI auto-training on startup: ${
        error instanceof Error ? error.message : 'unknown error'
      }`,
    );
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
