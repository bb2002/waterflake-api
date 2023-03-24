import { BadRequestException } from '@nestjs/common';

export default class SubDomainTooShortException extends BadRequestException {
  constructor() {
    super('subdomain is too short');
  }
}
