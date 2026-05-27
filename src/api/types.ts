import type { DefaultError, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

export type QueryOptions<Data = unknown> = Omit<UseQueryOptions<Data>, 'queryKey' | 'queryFn'>;

export type MutationOptions<Data = unknown, Params = unknown> = Omit<
    UseMutationOptions<Data, DefaultError, Params>,
    'queryKey' | 'queryFn'
>;
