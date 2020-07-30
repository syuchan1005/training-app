// eslint-disable-next-line import/prefer-default-export
import { ApolloError } from 'apollo-server-koa';

export const Errors = {
  QL0000: 'UNIMPLEMENTED',
  QL0001: 'USER NOT FOUND',
  QL0002: 'INTERNAL SERVER ERROR',
  QL0003: 'NOT AN ADMIN',
} as const;

export const createError = (
  code: keyof typeof Errors,
  message?: string,
  properties?: Record<string, any>,
) => new ApolloError(
  message,
  code,
  {
    ...properties,
    message: Errors[code],
  },
);
