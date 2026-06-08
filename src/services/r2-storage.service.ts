import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly s3Client: S3Client | null;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME', 'user-images');

    if (!accountId || !accessKeyId || !secretAccessKey) {
      this.logger.warn('Cloudflare R2 credentials are missing; image storage features are disabled');
      this.s3Client = null;
      return;
    }

    this.s3Client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: 'auto',
    });
  }

  private getS3Client(): S3Client {
    if (!this.s3Client) {
      throw new Error('Cloudflare R2 storage is not configured');
    }
    return this.s3Client;
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.getS3Client().send(command);
      return filePath;
    } catch (error) {
      this.logger.error(`Error uploading image to R2: ${error instanceof Error ? error.message : 'unknown'}`);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'unknown'}`);
    }
  }

  async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      return await getSignedUrl(this.getS3Client(), command, { expiresIn });
    } catch (error) {
      this.logger.error(`Error creating signed URL for R2: ${error instanceof Error ? error.message : 'unknown'}`);
      throw new Error(`Failed to create signed URL: ${error instanceof Error ? error.message : 'unknown'}`);
    }
  }

  async deleteImage(filePath: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      await this.getS3Client().send(command);
    } catch (error) {
      this.logger.error(`Error deleting image from R2: ${error instanceof Error ? error.message : 'unknown'}`);
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'unknown'}`);
    }
  }
}
