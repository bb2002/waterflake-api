import { NotFoundException } from '@nestjs/common';

export default class RegionNotFoundException extends NotFoundException {
  constructor() {
    super('Plan is not found.');
  }
}
