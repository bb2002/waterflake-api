import LoginProvider from '../../../common/enums/LoginProvider';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export default class CreateUserDto {
  @IsEnum(LoginProvider)
  loginProvider: LoginProvider;

  @IsString()
  snsId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  thumbnailUrl: string;
}
