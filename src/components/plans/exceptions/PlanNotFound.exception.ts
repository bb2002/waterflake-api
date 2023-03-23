import { NotFoundException } from '@nestjs/common';

export default class PlanNotFoundException extends NotFoundException {
  constructor() {
    super('Plan is not found.');
  }
}