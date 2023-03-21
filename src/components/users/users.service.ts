import { Injectable } from '@nestjs/common';
import CreateUserDto from './dto/CreateUser.dto';
import { Repository } from 'typeorm';
import UserEntity from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserBySnsId(snsId: string) {
    return this.userRepository.findOne({
      where: {
        snsId,
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    return this.userRepository.save({
      loginProvider: dto.loginProvider,
      snsId: dto.snsId,
      name: dto.name,
      email: dto.name,
      thumbnailUrl: dto.thumbnailUrl,
    });
  }
}
