import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export default class CreateTunnelFailureException extends InternalServerErrorException {
  constructor() {
    super('Failed to create tunnel');
  }
}
