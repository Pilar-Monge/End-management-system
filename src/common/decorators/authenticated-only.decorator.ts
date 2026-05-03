import { SetMetadata } from '@nestjs/common';

export const AuthenticatedOnly = () => SetMetadata('authenticatedOnly', true);
