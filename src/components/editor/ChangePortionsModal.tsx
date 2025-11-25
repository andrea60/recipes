import { useState } from "react";
import { ModalContentProps } from "../modal/useModal";
import { Slider } from "../ui/Slider";

type Props = ModalContentProps<{ portions: number }, { portions: number }>;
export const ChangePortionsModal = ({ portions, cancel, close }: Props) => {
  const [value, setValue] = useState(portions);

  return (
    <div className="flex flex-col w-full">
      <div className="min-w-72 mb-4">
        <label className="mb-2 block">
          How many portions do you want to cook?
        </label>
        <Slider
          min={0}
          max={10}
          step={1}
          stepLabelRenderer={(x) =>
            [0, 5, 10].includes(x) ? <span>{x}</span> : null
          }
          onChange={setValue}
          value={value}
        />
      </div>
      <div className="flex gap-2">
        <button className="btn btn-neutral" onClick={cancel}>
          Cancel
        </button>
        <button
          className="btn btn-primary grow"
          onClick={() => close({ portions: value })}
        >
          Cook {value} portions
        </button>
      </div>
    </div>
  );
};
