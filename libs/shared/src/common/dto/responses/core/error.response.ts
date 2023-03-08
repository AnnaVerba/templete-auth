import { ApiProperty } from '@nestjs/swagger';
import { CoreResponse } from './core.response';

export class ErrorResponse extends CoreResponse {
  @ApiProperty({ example: 404 })
  code: number;

  @ApiProperty({ example: 'Not found' })
  message: string;

  @ApiProperty({ example: false })
  isValidationError: boolean;
}
