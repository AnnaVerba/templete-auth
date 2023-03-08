import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import { responseValidatorInterceptor } from '../interceptors';

export const responseValidator = <T>(classRef: Type<T>): ((...args: any) => void) => {
  return applyDecorators(UseInterceptors(new responseValidatorInterceptor(classRef)));
};
