import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import GoogleLoginResult from './types/GoogleLoginResult';
import { KakaoLoginResult } from './types/KakaoLoginResult';
import CreateUserDto from '../users/dto/CreateUser.dto';
import UserEntity from '../users/entities/user.entity';
import JwtLoginResult from './types/JwtLoginResult';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  async getUserProfileFromKakao(
    accessToken: string,
  ): Promise<KakaoLoginResult | null> {
    try {
      const { data } = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return data as KakaoLoginResult;
    } catch (ex) {
      return null;
    }
  }

  async getOrCreateUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersService.findUserBySnsId(dto.snsId);
    if (user) {
      return user;
    }

    return this.usersService.createUser(dto);
  }

  async login(user: UserEntity): Promise<JwtLoginResult> {
    const payload = { sub: user._id };

    return {
      name: user.name,
      thumbnailUrl: user.thumbnailUrl,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
