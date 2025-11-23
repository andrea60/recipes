import { useMemo } from "react";
import { QueryResult } from "./useRealtimeQuery";

export const useQueryTransform = <TData, TResult>(
  query: QueryResult<TData>,
  transform: (query: TData[]) => TResult[],
  deps: unknown[]
): QueryResult<TResult> => {
  return useMemo(() => {
    if (query.pending) return { pending: true, data: undefined };

    return {
      pending: false,
      data: transform(query.data!),
    };
  }, [query, ...deps]);
};
