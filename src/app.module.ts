import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AdmissionRequestModule } from './modules/admissionRequest/admissionRequest.module';
import { CampModule } from './modules/camp/camp.module';
import { PersonModule } from './modules/person/person.module';
import { ResourceTypeModule } from './modules/resourceType/resourceType.module';
import { UserModule } from './modules/systemUser/systemUser.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER ?? 'gestionfin',
      password: process.env.DB_PASSWORD ?? 'gestionfin123',
      database: process.env.DB_NAME ?? 'gestionfin_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AdmissionRequestModule,
    PersonModule,
    CampModule,
    ResourceTypeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
