import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersService],
})
export class AuthModule {}
