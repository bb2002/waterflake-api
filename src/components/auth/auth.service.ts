import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import GoogleLoginResult from './types/GoogleLoginResult';
import CreateUserDto from '../users/dto/CreateUser.dto';
import UserEntity from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async getUserProfileFromGoogle(
    accessToken: string,
  ): Promise<GoogleLoginResult | null> {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
      );

      return data as GoogleLoginResult;
    } catch (ex) {
      return null;
    }
  }

  async getOrCreateUser(dto: CreateUserDto): Promise<UserEntity> {
    throw new Error();
  }
}
