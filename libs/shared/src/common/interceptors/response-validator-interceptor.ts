import { ExecutionContext, CallHandler, NestInterceptor, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass, ClassTransformOptions } from 'class-transformer';
import * as rxo from 'rxjs/operators';
import { Constructor } from '../types';
import { Observable } from 'rxjs';

export class responseValidatorInterceptor<T extends Constructor> implements NestInterceptor {
  private readonly classRef: T;
  private readonly _options?: ClassTransformOptions;

  constructor(classRef: T, options?: ClassTransformOptions) {
    this.classRef = classRef;
    this._options = options;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<Promise<{}>> {
    return next.handle().pipe(
      rxo.map(async (value: any) => {
        if (value.length) {
          const objects = [];
          for (const element of value) {
            const object = plainToClass(this.classRef, element, {
              excludeExtraneousValues: true,
            });
            const errors = await validate(object);
            if (errors.length > 0) {
              const errorMessage = Object.values(errors[0].constraints)[0];
              throw new BadRequestException(errorMessage);
            }
            objects.push(object);
          }

          return objects;
        }

        const object = plainToClass(this.classRef, value, {
          excludeExtraneousValues: true,
        });
        const errors = await validate(object);
        if (errors.length > 0) {
          const errorMessage = Object.values(errors[0].constraints)[0];
          throw new BadRequestException(errorMessage);
        }
        return object;
      }),
    );
  }
}
