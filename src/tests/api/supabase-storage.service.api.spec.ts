import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SupabaseStorageService } from '../../services/supabase-storage.service';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid-1234'),
}));

describe('SupabaseStorageService', () => {
  let configService: jest.Mocked<ConfigService>;
  let supabaseStorage: any;
  let service: SupabaseStorageService;

  beforeEach(() => {
    supabaseStorage = {
      from: jest.fn(),
    };

    (createClient as jest.Mock).mockReturnValue({
      storage: supabaseStorage,
    });

    configService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        if (key === 'SUPABASE_URL') return 'https://example.supabase.co';
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'service-role-key';
        if (key === 'SUPABASE_BUCKET_NAME') return 'user-images';
        return defaultValue;
      }),
    } as any;

    service = new SupabaseStorageService(configService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('disables storage when Supabase credentials are missing', async () => {
    jest.clearAllMocks();
    
    const badConfig = {
      get: jest.fn((key: string, defaultValue?: string) => {
        if (key === 'SUPABASE_BUCKET_NAME') return 'user-images';
        return defaultValue;
      }),
    } as any;

    const disabledService = new SupabaseStorageService(badConfig);
    const file = {
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    await expect(disabledService.uploadImage(file)).rejects.toThrow(
      'Supabase image storage is not configured',
    );
    expect(createClient).not.toHaveBeenCalled();
  });

  it('uploads image and returns file path', async () => {
    const upload = jest.fn().mockResolvedValue({ error: null });
    const from = jest.fn().mockReturnValue({ upload });
    supabaseStorage.from.mockReturnValue({ upload });
    const file = {
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    const result = await service.uploadImage(file, 'admissions');

    expect(result).toBe('admissions/mocked-uuid-1234.jpg');
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(upload).toHaveBeenCalledWith(
      'admissions/mocked-uuid-1234.jpg',
      file.buffer,
      expect.objectContaining({ contentType: 'image/jpeg', upsert: false }),
    );
  });

  it('throws when upload fails', async () => {
    const upload = jest.fn().mockResolvedValue({ error: { message: 'boom' } });
    supabaseStorage.from.mockReturnValue({ upload });
    const file = {
      originalname: 'photo.png',
      mimetype: 'image/png',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    await expect(service.uploadImage(file)).rejects.toThrow('Failed to upload image: boom');
  });

  it('returns signed url', async () => {
    const createSignedUrl = jest.fn().mockResolvedValue({
      data: { signedUrl: 'https://example.com/signed' },
      error: null,
    });
    supabaseStorage.from.mockReturnValue({ createSignedUrl });

    await expect(service.getSignedUrl('path/file.jpg', 120)).resolves.toBe(
      'https://example.com/signed',
    );
    expect(createSignedUrl).toHaveBeenCalledWith('path/file.jpg', 120);
  });

  it('throws when signed url creation fails', async () => {
    const createSignedUrl = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'nope' },
    });
    supabaseStorage.from.mockReturnValue({ createSignedUrl });

    await expect(service.getSignedUrl('path/file.jpg')).rejects.toThrow(
      'Failed to create signed URL: nope',
    );
  });

  it('deletes image successfully', async () => {
    const remove = jest.fn().mockResolvedValue({ error: null });
    supabaseStorage.from.mockReturnValue({ remove });

    await expect(service.deleteImage('path/file.jpg')).resolves.toBeUndefined();
    expect(remove).toHaveBeenCalledWith(['path/file.jpg']);
  });

  it('throws when delete fails', async () => {
    const remove = jest.fn().mockResolvedValue({ error: { message: 'delete error' } });
    supabaseStorage.from.mockReturnValue({ remove });

    await expect(service.deleteImage('path/file.jpg')).rejects.toThrow(
      'Failed to delete image: delete error',
    );
  });
});
