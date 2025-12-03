import classNames from "classnames";
import { useMemo } from "react";
import { vibrate } from "../../utils/vibrate";

type Props = {
  min: number;
  max: number;
  step: number;
  value: number;
  stepLabelRenderer: (step: number) => React.ReactElement | null;
  onChange: (value: number) => void;
  className?: string;
};
export const Slider = ({
  max,
  min,
  onChange,
  step,
  value,
  stepLabelRenderer,
}: Props) => {
  const steps = useMemo(() => {
    const stepsArr = new Array(Math.round((max - min) / step) + 1);
    stepsArr.fill(null);
    return stepsArr;
  }, [max, min]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
    vibrate();
  };
  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="range w-full range-sm"
        step={step}
      />
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        {steps.map((_, index) => (
          <span
            key={index}
            className={classNames({ "font-bold": index === value })}
          >
            |
          </span>
        ))}
      </div>
      <div className="flex justify-between px-2.5 mt-2 text-xs">
        {steps.map((_, index) => (
          <span key={index}>{stepLabelRenderer(min + step * index)}</span>
        ))}
      </div>
    </div>
  );
};
