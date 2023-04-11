import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { TunnelsService } from '../tunnels/services/tunnels.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [TunnelsService, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
