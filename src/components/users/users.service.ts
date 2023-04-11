import { Injectable, InternalServerErrorException } from '@nestjs/common';
import CreateUserDto from './dto/CreateUser.dto';
import { Repository } from 'typeorm';
import UserEntity from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TunnelsService } from '../tunnels/services/tunnels.service';
import UpdateUserDto from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tunnelsService: TunnelsService,
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

  async unregister(user: UserEntity) {
    // 내 터널들 가져오기
    const tunnels = await this.tunnelsService.getTunnelsByUser(user);

    try {
      // 전체 터널 삭제
      await Promise.all(
        tunnels.map((tunnel) => this.tunnelsService.deleteTunnel(tunnel)),
      );

      // 유저 삭제
      await this.userRepository.softDelete({
        _id: user._id,
      });
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException(ex);
    }
  }

  async updateUser(dto: UpdateUserDto, target: UserEntity) {
    return this.userRepository.update(
      {
        _id: target._id,
      },
      {
        ...(dto.name && { name: dto.name }),
        ...(dto.thumbnailUrl && { name: dto.thumbnailUrl }),
      },
    );
  }
}
