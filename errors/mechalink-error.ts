export class MechalinkError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, MechalinkError.prototype);
  }
}
