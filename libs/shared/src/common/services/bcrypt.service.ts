import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';

export class BcryptService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<void> {
    const match = await bcrypt.compare(password, hash);
    if (!match) {
      throw new BadRequestException('The password did not match');
    }
  }
}
