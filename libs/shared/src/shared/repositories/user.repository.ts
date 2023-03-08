import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService, FindAllQueryDto, PaginatedAllResponse, SortByRowEnums, UserResponse } from '../../common';
import { User, UserProfile } from '../../models';
import { Op, OrderItem } from 'sequelize';

@Injectable()
export class UserRepository extends AbstractService<User> {
  constructor(@InjectModel(User) private readonly userModel: Repository<User>) {
    super(userModel);
  }

  async findAllWithFilter(filterOptions: FindAllQueryDto): Promise<PaginatedAllResponse<UserResponse>> {
    const { limit, page, sortMethod, sortByRow, search } = filterOptions;
    const offset = page * limit;
    let order: OrderItem[] = [[{ model: UserProfile, as: 'profile' }, sortByRow, sortMethod]];
    if (sortByRow === SortByRowEnums.Email) {
      order = [[sortByRow, sortMethod]];
    }
    const include = {
      model: UserProfile,
      attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
    };
    if (search) {
      include['where'] = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `${search}%` } },
          { lastName: { [Op.iLike]: `${search}%` } },
          { phone: { [Op.iLike]: `${search}%` } },
        ],
      };
    }
    const result = await this.findAndCount({
      limit,
      offset,
      order,
      attributes: { exclude: ['password'] },
      include,
    });
    const totalCount = result.count;
    const data = result.rows.map((r) => {
      return r.get({ plain: true });
    });
    return {
      data,
      meta: {
        totalCount,
        count: data.length,
        page,
        limit,
        offset,
        search,
      },
    };
  }
}
