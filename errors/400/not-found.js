import { MechalinkError } from '../mechalink-error.js';

export class MechalinkAlreadyExists extends MechalinkError {
  constructor(message = 'NotFound') {
    super(message, 403);
  }
}
