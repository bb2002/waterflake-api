import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { TunnelsModule } from '../tunnels/tunnels.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [TunnelsModule, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
