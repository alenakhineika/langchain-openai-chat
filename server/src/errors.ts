export class GenAIError extends Error {
  errorCode: string;
  status: number;

  constructor(message: string, errorCode: string, status: number) {
    super(message);
    this.name = 'AIError';
    this.errorCode = errorCode;
    this.status = status;
  }
}

export class HttpError extends Error {
  errorCode: string;
  status: number;
  message: string;

  constructor(data: { status: number; errorCode: string; message: string }) {
    super(data.message);
    this.errorCode = data.errorCode;
    this.status = data.status;
    this.message = data.message;
  }
}
