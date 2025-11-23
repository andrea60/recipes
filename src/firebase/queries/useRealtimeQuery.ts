import {
  DocumentData,
  onSnapshot,
  Query,
  QuerySnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";

export type PendingQuery = {
  pending: true;
  data?: undefined;
};
export type ReadyQuery<TData> = {
  pending: false;
  data: TData[];
};
export type QueryResult<TData> = PendingQuery | ReadyQuery<TData>;

export const useRealtimeQuery = <TData, TDoc extends DocumentData>(
  query: Query<TData, TDoc>
): QueryResult<TData> => {
  const [snapshot, setSnapshot] = useState<QuerySnapshot<TData, TDoc>>();

  useEffect(() => {
    setSnapshot(undefined);
    const unsub = onSnapshot(query, (querySnapshot) => {
      setSnapshot(querySnapshot);
    });

    return () => {
      unsub();
    };
  }, []);

  if (!snapshot) return { pending: true };

  return { pending: false, data: snapshot.docs.map((doc) => doc.data()) };
};
