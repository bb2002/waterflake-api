import { BadRequestException, NotFoundException } from '@nestjs/common';

export default class RegionNotFoundException extends BadRequestException {
  constructor() {
    super('Plan is not found.');
  }
}
