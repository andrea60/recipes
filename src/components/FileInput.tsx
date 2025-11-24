import classNames from "classnames";
import { FileDef } from "../data/useCreateRecipe";

type Props = {
  className?: string;
  onChange: (file: FileDef | undefined) => void;
};
export const FileInput = ({ className, onChange }: Props) => {
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return onChange(undefined);

    const extension = getFileExtension(file.name);
    if (!extension) return onChange(undefined);

    onChange({
      content: await file.arrayBuffer(),
      extension,
      contentType: file.type,
    });
  };
  return (
    <input
      type="file"
      className={classNames("file-input", className)}
      onChange={handleFileSelected}
    />
  );
};

const getFileExtension = (path: string) => {
  const parts = path.split(".");
  if (parts.length < 2) return undefined;

  return parts[parts.length - 1];
};
