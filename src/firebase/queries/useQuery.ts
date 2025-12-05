import {
  DocumentData,
  getDocs,
  Query,
  QuerySnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { QueryResult } from "./useRealtimeQuery";

export const useQuery = <TData, TDoc extends DocumentData>(
  query: Query<TData, TDoc>
): QueryResult<TData> => {
  const [snapshot, setSnapshot] = useState<QuerySnapshot<TData, TDoc>>();

  useEffect(() => {
    setSnapshot(undefined);

    getDocs(query).then(setSnapshot);
  }, []);

  if (!snapshot) return { pending: true };

  return { pending: false, data: snapshot.docs.map((doc) => doc.data()) };
};
