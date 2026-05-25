import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private readonly supabase: SupabaseClient | null;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.bucketName = this.configService.get<string>('SUPABASE_BUCKET_NAME', 'user-images');

    if (!supabaseUrl || !supabaseServiceKey) {
      this.logger.warn('Supabase credentials are missing; image storage features are disabled');
      this.supabase = null;
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  private getSupabaseClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase image storage is not configured');
    }

    return this.supabase;
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await this.getSupabaseClient()
      .storage.from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Error uploading image to Supabase: ${error.message}`);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    return filePath;
  }

  async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.getSupabaseClient()
      .storage.from(this.bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      this.logger.error(`Error creating signed URL: ${error.message}`);
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  async deleteImage(filePath: string): Promise<void> {
    const { error } = await this.getSupabaseClient()
      .storage.from(this.bucketName)
      .remove([filePath]);

    if (error) {
      this.logger.error(`Error deleting image from Supabase: ${error.message}`);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}
