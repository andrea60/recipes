import { useLayoutEffect, useRef, useState } from "react";

export const useElementHeight = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    setHeight(ref.current.clientHeight);
  });

  return [ref, height] as const;
};
