
import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PositiveNumberPipe implements PipeTransform {
  transform(value: string): number {
    const numberValue = Number(value);

    if (
      !Number.isInteger(numberValue) ||
      numberValue <= 0
    ) {
      throw new BadRequestException(
        'Value must be a positive integer',
      );
    }

    return numberValue;
  }
}
