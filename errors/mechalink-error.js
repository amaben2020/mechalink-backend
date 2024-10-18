export class MechalinkError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
