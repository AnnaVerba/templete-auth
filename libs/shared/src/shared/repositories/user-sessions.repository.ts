import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService } from '../../common';
import { UserSession } from '../../models';

@Injectable()
export class UserSessionRepository extends AbstractService<UserSession> {
  constructor(@InjectModel(UserSession) private readonly userSessionModel: Repository<UserSession>) {
    super(userSessionModel);
  }
}
