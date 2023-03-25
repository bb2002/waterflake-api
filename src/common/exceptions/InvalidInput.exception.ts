import { BadRequestException } from '@nestjs/common';

export default class InvalidInputException extends BadRequestException {
    constructor() {
        super('Invalid input');
    }
}
