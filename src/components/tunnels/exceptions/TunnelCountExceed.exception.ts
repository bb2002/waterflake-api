import { BadRequestException } from '@nestjs/common';

export default class TunnelCountExceedException extends BadRequestException {
  constructor() {
    super('your tunnel count exceeded');
  }
}
