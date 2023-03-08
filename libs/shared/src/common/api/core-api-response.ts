import { Code } from './code';
import { Nullable } from '../';

export class CoreApiResponse<TData> {
  public readonly code: number;

  public readonly message: string;

  public readonly timestamp: number;

  public readonly data: Nullable<TData>;

  public readonly isValidationError: boolean;

  private constructor(code: number, message: string, data?: TData, isValidationError?: boolean) {
    this.code = code;
    this.message = message;
    this.data = data || null;
    this.timestamp = Date.now();
    this.isValidationError = isValidationError;
  }

  public static success<TData>({
    data,
    message,
  }: {
    data?: TData;
    message?: string;
  } = {}): CoreApiResponse<TData> {
    const resultCode: number = Code.SUCCESS.code;
    const resultMessage: string = message || Code.SUCCESS.message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }

  public static created<TData>(data?: TData, message?: string): CoreApiResponse<TData> {
    const resultCode: number = Code.CREATED.code;
    const resultMessage: string = message || Code.CREATED.message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }

  public static error<TData>(
    code?: number,
    message?: string,
    data?: TData,
    isValidationError?: boolean,
  ): CoreApiResponse<TData> {
    const resultCode: number = code || Code.INTERNAL_ERROR.code;
    const resultMessage: string = message || Code.INTERNAL_ERROR.message;

    return new CoreApiResponse(resultCode, resultMessage, data, isValidationError);
  }
}
