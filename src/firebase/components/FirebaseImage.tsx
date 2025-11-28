import { forwardRef } from "react";
import { useFirebaseDownloadUrl } from "../useFirebaseDownloadUrl";

type Props = {
  firebasePath: string;
  className?: string;
};

export const FirebaseImage = forwardRef<HTMLImageElement, Props>(
  ({ firebasePath, ...others }, ref) => {
    const url = useFirebaseDownloadUrl(firebasePath);
    console.log({ url });
    return <img src={url} {...others} ref={ref} />;
  }
);

FirebaseImage.displayName = "FirebaseImage";
