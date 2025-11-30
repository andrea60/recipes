import { useEffect, useState } from "react";

export const useScrollState = (ref: React.RefObject<HTMLElement | null>) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const handler = () => {
      if (!ref.current) return;
      setIsAtTop(ref.current.scrollTop <= 0);
    };
    handler();

    el.addEventListener("scroll", handler);

    return () => {
      el.removeEventListener("scroll", handler);
    };
  }, [ref.current]);

  return !isAtTop;
};
