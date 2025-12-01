import {
  easeIn,
  easeOut,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import React, { createContext, useContext, useRef, useState } from "react";

const MAX_HEADER = 280; // px
const MIN_HEADER = 80; // px
const HEADER_GUTTER = 25; // px
const COLLAPSE_DISTANCE = 200; // px of scroll until fully collapsed

type Context = {
  isAnchored: boolean;
};
const Context = createContext<Context>({ isAnchored: false });

type Props = {
  headerContent: React.ReactNode;
  children: React.ReactNode;
};

export const CollapsibleHeaderLayout = ({ headerContent, children }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    container: containerRef, // <-- track scroll inside this div
  });
  const [isAnchored, setIsAnchored] = useState(false);

  const progress = useMotionValue(0);

  // Update progress based on scrollY
  useMotionValueEvent(scrollY, "change", (latest) => {
    const p = Math.min(latest / COLLAPSE_DISTANCE, 1);
    progress.set(p);
    if (p >= 1) setIsAnchored(true);

    if (p <= 0) setIsAnchored(false);
  });

  const height = useTransform(
    progress,
    [0, 1],
    [MAX_HEADER + HEADER_GUTTER, MIN_HEADER + HEADER_GUTTER]
  );

  const blur = useTransform(progress, [0, 1], ["blur(0px)", "blur(2px)"], {
    ease: easeIn,
  });

  return (
    <Context.Provider value={{ isAnchored }}>
      <div
        className="h-screen overflow-y-auto scroll hide-scrollbar scroll-no-bounce"
        ref={containerRef}
      >
        {/* Header */}
        <motion.div
          className="sticky top-0"
          style={{ height: MAX_HEADER + HEADER_GUTTER }}
        >
          <motion.div
            style={{ height: height }}
            className="absolute top-0 w-full"
          >
            <motion.div
              className="absolute top-0 w-full h-full "
              style={{ backdropFilter: blur }}
            />
            {headerContent}
          </motion.div>
        </motion.div>
        {/* Content */}
        <motion.div
          className="p-4 h-screen rounded-t-box sticky bg-base-200 flex flex-col shadow-[0_0px_11px_0px_rgb(0,0,0,120)]"
          style={{
            height: `calc(100vh - ${MIN_HEADER}px)`,
            marginTop: -HEADER_GUTTER,
          }}
        >
          {children}
        </motion.div>
      </div>
    </Context.Provider>
  );
};

export const useCollapsibleHeaderState = () => {
  return useContext(Context);
};
