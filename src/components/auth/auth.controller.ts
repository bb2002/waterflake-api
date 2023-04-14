import {
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import InvalidAccessTokenException from './exceptions/InvalidAccessToken.exception';
import transformAndValidate from '../../common/utils/TransformAndValidate';
import CreateUserDto from '../users/dto/CreateUser.dto';
import LoginProvider from '../../common/enums/LoginProvider';
import { TunnelsService } from '../tunnels/services/tunnels.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tunnelsService: TunnelsService,
  ) {}

  @Post('/google')
  async googleLogin(@Headers('Authorization') authorizationField: string) {
    const accessToken = this.getOrThrowBearerToken(authorizationField);

    const googleUserProfile = await this.authService.getUserProfileFromGoogle(
      accessToken,
    );
    if (!googleUserProfile) {
      throw new InvalidAccessTokenException();
    }

    const createUserDto = await transformAndValidate(CreateUserDto, {
      loginProvider: LoginProvider.GOOGLE,
      snsId: googleUserProfile.id,
      name: googleUserProfile.name,
      email: googleUserProfile.email,
      thumbnailUrl: googleUserProfile.picture,
    });

    const user = await this.authService.getOrCreateUser(createUserDto);

    return this.authService.login(user);
  }

  @Post('/tunnel/:clientId')
  async tunnelLogin(
    @Param('clientId') clientId: string,
    @Headers('Authorization') authorizationField: string,
  ) {
    const clientSecret = this.getOrThrowBearerToken(authorizationField);
    const tunnel = await this.tunnelsService.getTunnelByClientId(clientId);
    if (!tunnel || tunnel.clientSecret !== clientSecret) {
      throw new NotFoundException();
    }

    delete tunnel.owner;
    delete tunnel.region;
    delete tunnel.plan;

    return tunnel;
  }

  private getOrThrowBearerToken(token: string): string {
    if (token && token.startsWith('Bearer ')) {
      return token.replace('Bearer ', '');
    }

    throw new InvalidAccessTokenException();
  }
}
