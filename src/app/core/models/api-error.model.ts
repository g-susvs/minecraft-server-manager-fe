export type TApiErrorCode =
  | 'NETWORK'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'SERVER';

export interface IApiError {
  code: TApiErrorCode;
  status: number;
  message: string;
}
