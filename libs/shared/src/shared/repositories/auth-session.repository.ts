import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService } from '../../common';
import { AuthSession } from '../../models';

@Injectable()
export class AuthSessionRepository extends AbstractService<AuthSession> {
  constructor(@InjectModel(AuthSession) private readonly authSessionModel: Repository<AuthSession>) {
    super(authSessionModel);
  }
}
