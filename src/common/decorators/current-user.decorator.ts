import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import UserEntity from '../../components/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest();
    if (req.user) {
      return req.user as UserEntity;
    }

    throw new UnauthorizedException('Unauthorized');
  },
);
