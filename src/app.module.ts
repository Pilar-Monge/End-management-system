import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdmissionRequestModule } from './modules/admissionRequest/admissionRequest.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, AdmissionRequestModule],
  controllers: [AppController],
})
export class AppModule {}
