import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useModal } from "../../components/modal/useModal";
import { ChangePortionsModal } from "./ChangePortionsModal";
import { motion } from "motion/react";

type Props = {
  onChange: (quantity: number) => void;
  portions: number;
};
export const PortionsQuantityControls = ({ onChange, portions }: Props) => {
  const { openModal } = useModal();
  const addPortionsQuantity = (quantity: number) => {
    const newVal = portions + quantity;
    if (newVal < 1) return;
    onChange(newVal);
  };

  const handlePortionsButtonClick = async () => {
    const { result, reason } = await openModal({
      component: ChangePortionsModal,
      title: "Change Cooking Portions",
      componentProps: { portions },
      fullWidth: true,
      mode: "dialog",
    });

    if (reason !== "complete") return;

    onChange(result.portions);
  };

  return (
    <motion.div
      className="rounded-box shadow-md shadow-black absolute -top-4"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 1,
        y: -10,
        transition: { bounce: 0 },
      }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.2, bounce: 0.4 },
      }}
    >
      <button
        className="btn btn-primary rounded-l-box rounded-r-none border-none -mr-1 shadow-none"
        onClick={() => addPortionsQuantity(-1)}
      >
        <MinusIcon weight="bold" />
      </button>
      <button
        className="btn btn-primary rounded-none border-none shadow-none text-xl"
        onClick={handlePortionsButtonClick}
      >
        {portions}
      </button>
      <button
        className="btn btn-primary rounded-r-box rounded-l-none border-none -ml-1 shadow-none"
        onClick={() => addPortionsQuantity(1)}
      >
        <PlusIcon weight="bold" />
      </button>
    </motion.div>
  );
};
