import { ForbiddenException } from '@nestjs/common';

export default class InvalidAccessTokenException extends ForbiddenException {
  constructor() {
    super('AccessToken is invalid.');
  }
}
