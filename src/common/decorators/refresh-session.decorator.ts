import { SetMetadata } from '@nestjs/common';

export const RefreshSession = () => SetMetadata('refreshSession', true);
