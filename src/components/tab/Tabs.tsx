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
  enableScroll?: boolean;
  disabled?: boolean;
};

export const Tabs = ({
  tabs,
  selectedId,
  onTabChange,
  maxWidth,
  enableScroll,
  disabled,
}: Props) => {
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
      <AnimatePresence mode="popLayout" initial={false}>
        {!disabled && (
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0,
                // y: -10,
                transition: { bounce: 0 },
              }}
              transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.2, bounce: 0.4 },
              }}
              className={classNames(
                "tabs tabs-sm flex-nowrap tabs-box bg-base-300 mb-4 inline-flex w-full"
              )}
              style={{ maxWidth }}
            >
              {tabs.map((tab) => (
                <>
                  <button
                    className={classNames("tab flex-1 bg-transparent!", {
                      "tab-active": tab.id === selectedId,
                    })}
                    disabled={disabled}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedTab && (
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={selectedTab.id}
            className={classNames({ "overflow-y-scroll": enableScroll })}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
            layout="position"
          >
            {selectedTab.content}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};
