import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebase.config";
import { useEffect } from "react";
import { atom, useAtom } from "jotai";

type CacheEntry = {
  url: string;
  expiry: Date;
};
const downloadUrlsCache = atom<Record<string, CacheEntry>>({});

export const useFirebaseDownloadUrl = (filePath: string) => {
  const [cache, setCache] = useAtom(downloadUrlsCache);

  useEffect(() => {
    const loadUrl = async () => {
      const cacheHit = cache[filePath];
      if (cacheHit && cacheHit.expiry > new Date()) {
        return;
      }

      const imageRef = ref(storage, filePath);
      const url = await getDownloadURL(imageRef);
      setCache((c) => ({
        ...c,
        [filePath]: {
          url,
          // expires in 30 minutes (60 minutes is the expiration date in Firebase by default)
          expiry: new Date(Date.now() + 1000 * 60 * 30),
        },
      }));
    };

    loadUrl();
  }, [filePath]);

  return cache[filePath]?.url;
};
