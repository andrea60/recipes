import { useState } from "react";

export const useAsyncAction = <TArgs extends readonly unknown[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>
) => {
  const [inProgress, setInProgress] = useState(false);

  const execute = async (...args: TArgs) => {
    setInProgress(true);
    try {
      return await action(...args);
    } finally {
      setInProgress(false);
    }
  };
  return { inProgress, execute };
};
