
export class ApiError extends Error {
  code?: number

  constructor(message: string, code?: number) {
    super(message)
    this.code = code
  }
}

export type ApiErrorType =
  | "NotFoundError"
  | "ValidationError"
  | "UnauthenticatedError"
  | "UnauthorizedError"
  | "MethodNotAllowedError"
  | "InsufficientTokensError"
  | "GenerateAlreadyPendingError"
  | "GenerateError"
  | "InternalServerError"

export interface ApiErrorPayload {
  error: {
    type: ApiErrorType
    message: string
    code: number
  }
}

export class NotFoundError extends ApiError {}
export class ValidationError extends ApiError {}
export class UnauthenticatedError extends ApiError {}
export class UnauthorizedError extends ApiError {}
export class MethodNotAllowedError extends ApiError {}
export class InsufficientTokensError extends ApiError {}
export class GenerateAlreadyPendingError extends ApiError {}
export class GenerateError extends ApiError {}
export class InternalServerError extends ApiError {}

export const errorMap = {
  NotFoundError,
  ValidationError,
  UnauthenticatedError,
  UnauthorizedError,
  MethodNotAllowedError,
  InsufficientTokensError,
  GenerateAlreadyPendingError,
  GenerateError,
  InternalServerError
} as const
