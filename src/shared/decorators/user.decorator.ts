import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IUserPayload } from '../types/user';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: IUserPayload }>();
    return request?.user?.id ?? null;
  },
);
