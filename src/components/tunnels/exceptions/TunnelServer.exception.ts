import { InternalServerErrorException } from '@nestjs/common';

export default class TunnelServerException extends InternalServerErrorException {
  constructor(msg: string) {
    super(`TunnelServerException: ${msg}`);
  }
}
