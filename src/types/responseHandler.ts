export type SuccessResponse<T> = {
  data: T;
  status: number;
  message: string;
  headers? : Record<string, string | undefined> | undefined;
};

export type ErrorResponseProps = {
  status: number;
  code: string;
  message: string;
  title: string;
};