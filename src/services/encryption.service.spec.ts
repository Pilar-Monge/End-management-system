import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  it('hashPassword returns a hash different from plain password', async () => {
    const plain = 'StrongPass#2026';

    const hashed = await EncryptionService.hashPassword(plain);

    expect(typeof hashed).toBe('string');
    expect(hashed).not.toBe(plain);
    expect(hashed.length).toBeGreaterThan(20);
  });

  it('comparePassword returns true for matching password and hash', async () => {
    const plain = 'AnotherStrongPass#2026';
    const hashed = await EncryptionService.hashPassword(plain);

    await expect(EncryptionService.comparePassword(plain, hashed)).resolves.toBe(true);
  });

  it('comparePassword returns false for non-matching password', async () => {
    const hashed = await EncryptionService.hashPassword('OriginalPass#2026');

    await expect(EncryptionService.comparePassword('WrongPass#2026', hashed)).resolves.toBe(false);
  });
});