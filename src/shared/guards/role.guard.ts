import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from 'src/generated/prisma/enums';
import { IUserPayload } from '../types/user';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly roles: UserRole[]) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: IUserPayload }>();
    const userRole = request.user.role;
    if (!this.roles.includes(userRole)) {
      return false;
    }

    return true;
  }
}
