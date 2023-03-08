import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService } from '../../common';
import { UserProfile } from '../../models';

@Injectable()
export class UserProfileRepository extends AbstractService<UserProfile> {
  constructor(@InjectModel(UserProfile) private readonly userProfileModel: Repository<UserProfile>) {
    super(userProfileModel);
  }
}
