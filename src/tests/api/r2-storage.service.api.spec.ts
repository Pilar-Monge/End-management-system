import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { R2StorageService } from '../../services/r2-storage.service';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(),
      };
    }),
    PutObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid-1234'),
}));

describe('R2StorageService', () => {
  let configService: jest.Mocked<ConfigService>;
  let service: R2StorageService;
  let mockS3Instance: any;

  beforeEach(() => {
    mockS3Instance = {
      send: jest.fn().mockResolvedValue({}),
    };
    (S3Client as jest.Mock).mockReturnValue(mockS3Instance);

    configService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        if (key === 'R2_ACCOUNT_ID') return 'mock-account-id';
        if (key === 'R2_ACCESS_KEY_ID') return 'mock-access-key';
        if (key === 'R2_SECRET_ACCESS_KEY') return 'mock-secret-key';
        if (key === 'R2_BUCKET_NAME') return 'user-images';
        return defaultValue;
      }),
    } as any;

    service = new R2StorageService(configService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('disables storage when Cloudflare R2 credentials are missing', async () => {
    jest.clearAllMocks();

    const badConfig = {
      get: jest.fn((key: string, defaultValue?: string) => {
        if (key === 'R2_BUCKET_NAME') return 'user-images';
        return defaultValue;
      }),
    } as any;

    const disabledService = new R2StorageService(badConfig);
    const file = {
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    await expect(disabledService.uploadImage(file)).rejects.toThrow(
      'Cloudflare R2 storage is not configured',
    );
    expect(S3Client).not.toHaveBeenCalled();
  });

  it('uploads image and returns file path', async () => {
    const file = {
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    const result = await service.uploadImage(file, 'admissions');

    expect(result).toBe('admissions/mocked-uuid-1234.jpg');
    expect(S3Client).toHaveBeenCalledTimes(1);
    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: 'user-images',
        Key: 'admissions/mocked-uuid-1234.jpg',
        Body: file.buffer,
        ContentType: 'image/jpeg',
      }),
    );
    expect(mockS3Instance.send).toHaveBeenCalledTimes(1);
  });

  it('throws when upload fails', async () => {
    mockS3Instance.send.mockRejectedValue(new Error('s3 connection failure'));
    const file = {
      originalname: 'photo.png',
      mimetype: 'image/png',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    await expect(service.uploadImage(file)).rejects.toThrow('Failed to upload image: s3 connection failure');
  });

  it('returns signed url', async () => {
    (getSignedUrl as jest.Mock).mockResolvedValue('https://example.com/signed');

    await expect(service.getSignedUrl('path/file.jpg', 120)).resolves.toBe(
      'https://example.com/signed',
    );
    expect(GetObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: 'user-images',
        Key: 'path/file.jpg',
      }),
    );
    expect(getSignedUrl).toHaveBeenCalledWith(mockS3Instance, expect.any(Object), { expiresIn: 120 });
  });

  it('throws when signed url creation fails', async () => {
    (getSignedUrl as jest.Mock).mockRejectedValue(new Error('presign failure'));

    await expect(service.getSignedUrl('path/file.jpg')).rejects.toThrow(
      'Failed to create signed URL: presign failure',
    );
  });

  it('deletes image successfully', async () => {
    await expect(service.deleteImage('path/file.jpg')).resolves.toBeUndefined();
    expect(DeleteObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: 'user-images',
        Key: 'path/file.jpg',
      }),
    );
    expect(mockS3Instance.send).toHaveBeenCalledTimes(1);
  });

  it('throws when delete fails with non-Error object', async () => {
    mockS3Instance.send.mockRejectedValue('non-error-delete-failure');

    await expect(service.deleteImage('path/file.jpg')).rejects.toThrow(
      'Failed to delete image: unknown',
    );
  });

  it('throws when delete fails with real Error object', async () => {
    mockS3Instance.send.mockRejectedValue(new Error('s3 delete failure'));

    await expect(service.deleteImage('path/file.jpg')).rejects.toThrow(
      'Failed to delete image: s3 delete failure',
    );
  });

  it('uploads image with default folder parameter "general"', async () => {
    const file = {
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    const result = await service.uploadImage(file);

    expect(result).toBe('general/mocked-uuid-1234.jpg');
  });

  it('throws when upload fails with non-Error object', async () => {
    mockS3Instance.send.mockRejectedValue('non-error-upload-failure');
    const file = {
      originalname: 'photo.png',
      mimetype: 'image/png',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    await expect(service.uploadImage(file)).rejects.toThrow('Failed to upload image: unknown');
  });

  it('returns signed url with default expiresIn parameter (3600)', async () => {
    (getSignedUrl as jest.Mock).mockResolvedValue('https://example.com/signed');

    await expect(service.getSignedUrl('path/file.jpg')).resolves.toBe(
      'https://example.com/signed',
    );
    expect(getSignedUrl).toHaveBeenCalledWith(mockS3Instance, expect.any(Object), { expiresIn: 3600 });
  });

  it('throws when signed url creation fails with non-Error object', async () => {
    (getSignedUrl as jest.Mock).mockRejectedValue('non-error-presign-failure');

    await expect(service.getSignedUrl('path/file.jpg')).rejects.toThrow(
      'Failed to create signed URL: unknown',
    );
  });
});
