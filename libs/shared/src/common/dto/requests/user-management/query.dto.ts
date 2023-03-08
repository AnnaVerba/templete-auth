import { SortByRowEnums, SortMethodEnums, WithSessionsEnums } from '@app/shared/common/enums';
import { transformStringToInt } from '@app/shared/common/helpers';
import { ApiPropertyOptional } from '@nestjs/swagger/dist';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsNumber } from 'class-validator';

export class FindOneQueryDto {
  @ApiPropertyOptional({ enum: WithSessionsEnums })
  @IsEnum(WithSessionsEnums)
  @IsOptional()
  withSessions?: string;
}

export class FindAllQueryDto {
  @ApiPropertyOptional({ description: 'Page number' })
  @Transform((value) => transformStringToInt(value))
  @IsOptional()
  @IsNumber()
  page?: number = 0;

  @ApiPropertyOptional({ description: 'Limit rows on page' })
  @Transform((value) => transformStringToInt(value))
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search filter' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Sorting method', enum: SortMethodEnums })
  @IsOptional()
  @IsEnum(SortMethodEnums)
  sortMethod?: string = SortMethodEnums.Asc;

  @ApiPropertyOptional({ description: 'Sort by row', enum: SortByRowEnums })
  @IsOptional()
  @IsEnum(SortByRowEnums)
  sortByRow?: string = SortByRowEnums.Email;
}
