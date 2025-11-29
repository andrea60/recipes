import { HandWavingIcon } from "@phosphor-icons/react";
import { ModalContentProps } from "../../components/modal/useModal";

type ModalProps = ModalContentProps;
export const LogoutModal = ({ cancel, close }: ModalProps) => {
  return (
    <>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-neutral flex-1" onClick={cancel}>
          No, stay here
        </button>
        <button className="btn btn-warning flex-1 text-nowrap" onClick={close}>
          Yes, log me out <HandWavingIcon />
        </button>
      </div>
    </>
  );
};
