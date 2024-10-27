import { MechalinkError } from '../mechalink-error.js';

export class MechalinkRequired extends MechalinkError {
  constructor(message = 'Required') {
    super(message, 422);
  }
}
