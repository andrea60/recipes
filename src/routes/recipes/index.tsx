import { createFileRoute } from "@tanstack/react-router";
import { ModalContentProps, useModal } from "../../components/modal/useModal";
import { useConfirm } from "../../components/modal/useConfirm";
import { useState } from "react";
import cn from "classnames";
import { showToast, ToastOptions } from "../../components/toastr/useToast";
import { CheckIcon } from "@heroicons/react/24/outline";
import { RecipesList } from "../../pages/RecipesList";
export const Route = createFileRoute("/recipes/")({
  component: RecipesList,
  beforeLoad: () => {
    return {
      pageTitle: "Recipes",
    };
  },
});

function RouteComponent() {
  const [conf, setConf] = useState(false);
  const { openModal } = useModal();
  const confirm = useConfirm();

  const handleModalClick = () => {
    openModal({
      title: "Sample Modal",
      component: SampleModalContent,
      componentProps: { now: new Date() },
      mode: "dialog",
    });
  };

  const handleConfirmationClick = async () => {
    const confirmed = await confirm({
      description:
        "Are you sure you want to continue? asd asd adjlashd jhaskldh jasdhka hsdlajhkjahsdjkh aksdjha shdkj",
      severity: "default",
      title: "Delete Recipe",
    });

    setConf(confirmed);
  };

  const displayToast = (severity: ToastOptions["severity"]) => {
    showToast({
      content: "This is a sample notification",
      title: "Recipe Created",
      icon: <CheckIcon />,
      severity: severity,
      type: "sticky",
    });
  };
  return (
    <div className="card card-border card-sm card-default">
      <div className="card-body">
        <div className="card-title">Example Card content</div>
        <button className="btn btn-sm btn-neutral" onClick={handleModalClick}>
          Open a Modal
        </button>
        <button
          className={cn("btn btn-sm", conf ? "btn-error" : "btn-neutral")}
          disabled={conf}
          onClick={handleConfirmationClick}
        >
          Open Confirmation Dialog
        </button>
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-success"
            onClick={() => displayToast("success")}
          >
            Success
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => displayToast("warning")}
          >
            Warning
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => displayToast("error")}
          >
            Error
          </button>
          <button
            className="btn btn-sm btn-default"
            onClick={() => displayToast("default")}
          >
            Default
          </button>
        </div>
      </div>
    </div>
  );
}

type ModalProps = ModalContentProps<{ action: "Ok" | "Ignore" }, { now: Date }>;
const SampleModalContent = ({ now }: ModalProps) => {
  return <p>Sample Modal Content opened at {now.toISOString()}</p>;
};
