export type ApiSuccess<T> = { ok: true; data: T };

export type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
