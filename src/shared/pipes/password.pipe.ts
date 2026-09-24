import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordPipe implements PipeTransform {
  constructor(private readonly isNew: boolean) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== `object` || !value?.password) {
      return value;
    }
    const pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/;

    const isValidPass = pass.test(value.password);
    if (!isValidPass) {
      throw new BadRequestException(
        'Password must be at least 8 characters and contain at least one letter and one number.',
      );
    }
    if (this.isNew) {
      const hashedPassword = await argon2.hash(value.password);
      return { ...value, password: hashedPassword };
    } else {
      return value;
    }
  }
}
