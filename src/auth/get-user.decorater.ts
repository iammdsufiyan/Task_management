import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from './user.entity';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
