import { useEffect, useState } from "react";

export const useScrollState = (ref: React.RefObject<HTMLElement | null>) => {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const handler = () => {
      if (!ref.current) return;
      setScrollOffset(ref.current.scrollTop);
    };
    handler();

    el.addEventListener("scroll", handler);

    return () => {
      el.removeEventListener("scroll", handler);
    };
  }, [ref.current]);

  // negative values are possible due to bounce scrolling on mobile
  const isAtTop = scrollOffset <= 0;

  return { isAtTop, scrollOffset };
};
