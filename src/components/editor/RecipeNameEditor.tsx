import classNames from "classnames";
import { useEffect, useState } from "react";
import { useResettableState } from "../../utils/useResettableState";

type Props = {
  name: string;
  onChange: (name: string) => void;
  readonly: boolean;
};
export const RecipeNameEditor = ({ name, readonly, onChange }: Props) => {
  const [lastValidValue, setLastValidValue] = useResettableState(name, [name]);
  const [value, setValue] = useResettableState(name, [name]);

  useEffect(() => {
    setLastValidValue(name);
    setValue(name);
  }, [name]);

  const handleBlur = () => {
    if (value === name) return;
    if (value.trim().length < 1) {
      setValue(lastValidValue);
      onChange(lastValidValue);
      return;
    }

    onChange(value);
    setLastValidValue(value);
  };

  const valid = value.trim().length > 0;

  return (
    <>
      <input
        type="text"
        className={classNames(
          "input rounded-none grow pl-0 font-bold text-3xl border-0! outline-0! bg-transparent!",
          {
            "input-error": !valid,
          }
        )}
        value={value}
        readOnly={readonly}
        onBlur={handleBlur}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};
