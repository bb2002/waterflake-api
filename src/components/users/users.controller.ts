import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import UserEntity from './entities/user.entity';
import UpdateUserDto from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUser(@CurrentUser() user: UserEntity) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  async unregister(@CurrentUser() user: UserEntity) {
    return this.usersService.unregister(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateUser(
    @CurrentUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(updateUserDto, user);
  }
}
