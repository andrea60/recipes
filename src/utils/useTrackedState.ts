import { useResettableState } from "./useResettableState";

export const useTrackedState = <TState>(
  state: TState,
  deps: unknown[] = []
) => {
  const [value, setValue] = useResettableState(state, deps);
  const [dirty, setDirty] = useResettableState(false, deps);

  const setState: React.Dispatch<React.SetStateAction<TState>> = (x) => {
    setDirty(true);
    setValue(x);
  };

  return [value, setState, dirty] as const;
};
