import { InternalServerErrorException } from '@nestjs/common';

export default class DeleteTunnelFailureException extends InternalServerErrorException {
  constructor() {
    super('Failed to delete tunnel');
  }
}
