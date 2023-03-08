import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedAllResponse } from '../dto';

export const apiOkResponsePaginated = <DataDto extends Type<unknown>>(dataDto: DataDto, description: string): any =>
  applyDecorators(
    ApiExtraModels(PaginatedAllResponse, dataDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedAllResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
