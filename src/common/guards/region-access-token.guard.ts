import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { RegionsService } from '../../components/regions/regions.service';

@Injectable()
export class RegionAccessTokenGuard implements CanActivate {
  constructor(
    @Inject(RegionsService) private readonly regionsService: RegionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request?.headers?.authorization as string;

    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      return !!(await this.regionsService.getRegionByToken(token));
    }

    return false;
  }
}
