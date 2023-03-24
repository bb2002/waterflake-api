import { BadRequestException } from '@nestjs/common';

export default class DomainAlreadyExistsException extends BadRequestException {
  constructor() {
    super('domain name already exists');
  }
}
