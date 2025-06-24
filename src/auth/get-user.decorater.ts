import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from './user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);


// @GetUser('id') userId: string



// export const GetUser = createParamDecorator(
//   (data: keyof UserEntity, ctx: ExecutionContext) => {
//     const req = ctx.switchToHttp().getRequest();
//     const user = req.user;
//     return data ? user?.[data] : user;
//   },
// );

