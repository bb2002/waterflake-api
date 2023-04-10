import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import RegionEntity from '../../components/regions/entities/region.entity';

export const CurrentRegion = createParamDecorator(
  (data: unknown, context: ExecutionContext): RegionEntity => {
    const req = context.switchToHttp().getRequest();
    if (req.region) {
      return req.region as RegionEntity;
    }

    throw new UnauthorizedException('Unauthorized');
  },
);
