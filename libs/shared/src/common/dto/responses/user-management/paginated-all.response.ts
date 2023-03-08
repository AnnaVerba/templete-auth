import { ApiProperty } from '@nestjs/swagger/dist';

class MetaResponse {
  @ApiProperty({ description: 'Count of all founded rows', example: 1 })
  totalCount: number;

  @ApiProperty({ description: 'Amount of rows on this page', example: 1 })
  count: number;

  @ApiProperty({ description: 'Page number. Default: 0', example: 0 })
  page: number;

  @ApiProperty({ description: 'Amount of rows on one page. Default: 10', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Offset. Equals to page multiply by limit', example: 0 })
  offset: number;

  @ApiProperty({ description: 'Search filter', example: 'first' })
  search: string;
}

export class PaginatedAllResponse<TData> {
  data: TData[];

  @ApiProperty({ description: 'Meta information' })
  meta: MetaResponse;
}
