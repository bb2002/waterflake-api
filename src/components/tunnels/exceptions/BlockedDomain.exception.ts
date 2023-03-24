import { BadRequestException } from '@nestjs/common';

export default class BlockedDomainException extends BadRequestException {
  constructor() {
    super('This domain is blocked');
  }
}
