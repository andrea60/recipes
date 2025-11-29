import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Tab = {
  id: string;
  header: React.ReactElement;
  content: React.ReactElement;
};

type Props = {
  tabs: Tab[];
  selectedId: string;
  onTabChange: (id: string) => void;
  maxWidth?: number;
};

export const Tabs = ({ tabs, selectedId, onTabChange, maxWidth }: Props) => {
  const currentIdx = tabs.findIndex((tab) => tab.id === selectedId);
  const [prevIdx, setPrevIdx] = useState(0);

  const direction = currentIdx > prevIdx ? -1 : 1;

  const handleTabChange = (id: string) => {
    setPrevIdx(currentIdx);
    onTabChange(id);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const selectedTab = tabs.find((tab) => tab.id === selectedId);
  return (
    <>
      <div className="flex justify-center">
        <div
          className={classNames(
            "tabs tabs-sm flex-nowrap tabs-box bg-base-300 mb-2 inline-flex w-full"
          )}
          style={{ maxWidth }}
        >
          {tabs.map((tab) => (
            <>
              <button
                className={classNames("tab flex-1 bg-transparent!", {
                  "tab-active": tab.id === selectedId,
                })}
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="z-10 flex gap-2 items-center flex-nowrap text-nowrap">
                  {tab.header}
                </span>
                {tab.id === selectedId && (
                  <motion.div
                    layout
                    layoutId="active-tab"
                    className="tab absolute tab-active w-full h-full bg-base-100"
                  />
                )}
              </button>
            </>
          ))}
        </div>
      </div>

      {selectedTab && (
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={selectedTab.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
          >
            {selectedTab.content}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};
