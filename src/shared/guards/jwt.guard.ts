import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IUserPayload } from '../types/user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: IUserPayload }>();
    const token = request.headers.authorization?.split(` `)[1];
    if (!token) {
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync<IUserPayload>(token);
      request[`user`] = payload;
    } catch (err) {
      return false;
    }
    return true;
  }
}
