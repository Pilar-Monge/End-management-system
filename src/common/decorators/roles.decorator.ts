import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';

const describeRoles = (roles: string[]): string =>
  roles.includes('NO_ACCESS')
    ? 'Endpoint disabled: no role is allowed to access this operation.'
    : `Requires one of these roles: ${roles.join(', ')}.`;

export const Roles = (...roles: string[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: describeRoles(roles) }),
  );
