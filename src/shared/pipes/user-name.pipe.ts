import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UserNamePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (typeof value === `object` && value.username) {
      const isValidUserName = usernameRegex.test(value.username);
      if (!isValidUserName) {
        throw new BadRequestException(
          'Username must be 3-20 characters and contain only letters, numbers and underscores.',
        );
      }
      return value;
    }
    return value;
  }
}
