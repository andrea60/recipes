import { useEffect, useRef } from "react";

export const useWakeLock = (lock: boolean) => {
  const wakeLockSentinel = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!lock) return;
    window.navigator.wakeLock.request("screen").then((wakeLock) => {
      wakeLockSentinel.current = wakeLock;
    });

    return () => {
      wakeLockSentinel.current?.release();
    };
  }, [lock]);
};
