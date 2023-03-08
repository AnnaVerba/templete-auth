import { ApiProperty } from '@nestjs/swagger';
import { CoreResponse } from '../core';

export class BadRequestExceptionResponse extends CoreResponse {
  @ApiProperty({ example: 400 })
  code: number;

  @ApiProperty({ example: 'Bad Request Exception' })
  message: string;

  @ApiProperty({ example: { message: ['name must be a string'] } })
  data: {
    message: string[];
  };
}
