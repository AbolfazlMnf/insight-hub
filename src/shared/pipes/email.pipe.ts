import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class EmailPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value === `object` && value.email) {
      const isValidEmail = emailRegex.test(value.email);
      if (!isValidEmail) {
        throw new BadRequestException(`email is invalid !!`);
      }
      return value;
    }
    return value;
  }
}
