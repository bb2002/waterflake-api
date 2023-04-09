import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import RegionEntity from '../../components/regions/entities/region.entity';

export const CurrentRegion = createParamDecorator(
  (data: unknown, context: ExecutionContext): RegionEntity => {
    const req = context.switchToHttp().getRequest();
    console.log('req.user', req.user);
    if (req.user) {
      return req.user as RegionEntity;
    }

    throw new UnauthorizedException('Unauthorized');
  },
);
