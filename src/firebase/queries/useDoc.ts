import { DocumentData, DocumentReference, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export type PendingDoc = {
  pending: true;
  data?: undefined;
  found?: undefined;
};

export type DocNotFound = {
  found: false;
  data?: undefined;
};

export type DocFound<TData> = {
  found: true;
  data: TData;
};

export type ReadyDoc<TData> = {
  pending: false;
} & (DocNotFound | DocFound<TData>);

export type DocResult<TData> = PendingDoc | ReadyDoc<TData>;

export const useDoc = <TData, TDoc extends DocumentData>(
  doc: DocumentReference<TData, TDoc>
): DocResult<TData> => {
  const [data, setData] = useState<TData>();
  const [found, setFound] = useState(false);
  useEffect(() => {
    const fetchDoc = async () => {
      const document = await getDoc(doc);

      if (!document.exists()) {
        setFound(false);
        setData(undefined);
      } else {
        setFound(true);
        setData(document.data());
      }
    };

    fetchDoc();
  }, []);

  if (!data) return { pending: true };

  if (found) return { pending: false, found: true, data };

  return { pending: false, found: false };
};
