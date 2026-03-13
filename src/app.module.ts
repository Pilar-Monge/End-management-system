import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AdmissionRequestModule } from './modules/admissionRequest/admissionRequest.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'gestionfin',
      password: process.env.DB_PASSWORD ?? 'gestionfin123',
      database: process.env.DB_NAME ?? 'gestionfin_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AdmissionRequestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
