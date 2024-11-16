export class MechalinkError extends Error {
  constructor(message: string, code: string | number) {
    super(message);
    //@ts-ignore
    this.code = code;
  }
}
