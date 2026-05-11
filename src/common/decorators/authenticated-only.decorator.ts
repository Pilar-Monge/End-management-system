import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';

export const AuthenticatedOnly = () =>
  applyDecorators(
    SetMetadata('authenticatedOnly', true),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Requires an authenticated user.' }),
  );
