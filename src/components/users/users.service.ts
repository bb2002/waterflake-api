import { Injectable } from '@nestjs/common';
import CreateUserDto from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  async findUserBySnsId(snsId: string) {
    throw new Error();
  }

  async createUser(dto: CreateUserDto) {
    throw new Error();
  }
}
