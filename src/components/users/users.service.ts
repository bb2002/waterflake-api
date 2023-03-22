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
        deletedAt: null,
      },
    });
  }

  async findUserById(id: number) {
    return this.userRepository.findOne({
      where: {
        _id: id,
        deletedAt: null,
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    return this.userRepository.save({
      loginProvider: dto.loginProvider,
      snsId: dto.snsId,
      name: dto.name,
      email: dto.email,
      thumbnailUrl: dto.thumbnailUrl,
    });
  }
}
