import { Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { CreateOptions, DestroyOptions, FindAndCountOptions, FindOptions, Model, UpdateOptions } from 'sequelize';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly model: Repository<T & Model>) {}

  async create(data, options?: CreateOptions<T>): Promise<Promise<T & Model>> {
    return this.model.create(data, options);
  }

  async findOne(options?: FindOptions<T>): Promise<T & Model> {
    return this.model.findOne(options);
  }

  async findAll(options?: FindOptions<T>): Promise<(T & Model)[]> {
    return this.model.findAll(options);
  }

  async throwIfExist(options?: FindOptions<T>): Promise<T & Model> {
    const record = await this.findOne(options);
    if (record) {
      throw new RpcException('AlreadyExists');
    }

    return record;
  }

  async throwIfNotExist(options?: FindOptions<T>): Promise<T & Model> {
    const record = await this.findOne(options);
    if (!record) {
      throw new RpcException('NotFound');
    }
    return record;
  }

  async update(values, options: UpdateOptions<T>): Promise<number[]> {
    return this.model.update(values, options);
  }

  async destroy(options: DestroyOptions<T>): Promise<number> {
    const result = await this.model.destroy(options);
    if (!result) {
      throw new RpcException('NotFound');
    }
    return result;
  }

  async findAndCount(options: FindAndCountOptions<T>): Promise<{ rows: T[]; count: number }> {
    return this.model.findAndCountAll(options);
  }

  // async paginate(page = 1, relations = []): Promise<any> {
  //   const take = 15;
  //   const [data, total] = await this.repository.findAndCount({
  //     take,
  //     skip: (page - 1) * take,
  //     relations,
  //   });
  //   return {
  //     data: data,
  //     meta: {
  //       total,
  //       page,
  //       last_page: Math.ceil(total / take),
  //     },
  //   };
  // }
  //
  // async create(data): Promise<any> {
  //   return this.repository.save(data);
  // }
  //
  // async findOne(condition, relations = []): Promise<any> {
  //   return this.repository.findOne({
  //     where: { id: condition.id },
  //     relations,
  //   });
  // }
  //
  // async update(id: number, data): Promise<any> {
  //   return this.repository.update(id, data);
  // }
  //
  // async delete(id: number): Promise<any> {
  //   return this.repository.delete(id);
  // }
}
