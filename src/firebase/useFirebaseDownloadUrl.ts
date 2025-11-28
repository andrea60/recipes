import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebase.config";
import { useEffect, useState } from "react";

export const useFirebaseDownloadUrl = (filePath: string) => {
  const imageRef = ref(storage, filePath);
  const [value, setValue] = useState<string>();

  useEffect(() => {
    setValue(undefined);
    const loadUrl = async () => {
      const url = await getDownloadURL(imageRef);
      setValue(url);
    };

    loadUrl();
  }, [filePath]);

  return value;
};
