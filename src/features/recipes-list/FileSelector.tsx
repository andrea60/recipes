import { CameraIcon, ClipboardIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { FileInput } from "../../components/FileInput";
import { FileDef } from "../../data/useCreateRecipe";
import classNames from "classnames";
import { getFileExtension } from "../../utils/getFileExtension";

const allowedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
];

type SelectMode = "upload" | "paste";
type Props = {
  onChange: (file: FileDef | undefined) => void;
};
export const FileSelector = ({ onChange }: Props) => {
  const [mode, setMode] = useState<SelectMode>("paste");
  const [pastedFileName, setPastedFileName] = useState<string>();
  const [pastedFileDef, setPastedFileDef] = useState<FileDef>();
  const [uploadedFileDef, setUploadedFileDef] = useState<FileDef>();

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "string") continue;
      const file = item.getAsFile();
      if (!file) continue;
      if (!allowedImageTypes.includes(file.type)) continue;

      const content = await file.arrayBuffer();
      const fileDef = {
        content,
        contentType: file.type,
        extension: getFileExtension(file.name)!,
      };
      setPastedFileDef(fileDef);
      setPastedFileName(file.name);
      onChange(fileDef);
    }
  };

  const handleFileSelected = (fileDef: FileDef | undefined) => {
    setUploadedFileDef(fileDef);
    onChange(fileDef);
  };

  const toggleMode = () => {
    if (mode === "paste") {
      setMode("upload");
      onChange(uploadedFileDef);
    } else {
      setMode("paste");
      onChange(pastedFileDef);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
  };
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend flex justify-around w-full">
        <span
          className={classNames({ "text-base-content/50": mode === "paste" })}
        >
          Upload
        </span>
        <label className="toggle text-base-content toggle-sm">
          <input
            type="checkbox"
            checked={mode === "paste"}
            onChange={toggleMode}
          />
          <CameraIcon aria-label="enabled" weight="fill" />
          <ClipboardIcon aria-label="disabled" weight="fill" />
        </label>
        <span
          className={classNames({ "text-base-content/50": mode === "upload" })}
        >
          Paste
        </span>
      </legend>
      {mode === "upload" ? (
        <FileInput onChange={handleFileSelected} />
      ) : (
        <input
          type="text"
          className="input"
          placeholder="Long press to paste image"
          onKeyDown={handleKeyDown}
          value={pastedFileName}
          onPaste={handlePaste}
          onChange={(_) => {}}
        />
      )}
    </fieldset>
  );
};
