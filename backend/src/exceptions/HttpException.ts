import { HttpError } from 'routing-controllers';

export class HttpException {
  public status: number;
  public message: string | any[];

  constructor(status: number, message: string | any[]) {
    // super(status, message);
    this.status = status;
    this.message = message;
  }
}
