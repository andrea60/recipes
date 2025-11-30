import { forwardRef } from "react";
import { useFirebaseDownloadUrl } from "../useFirebaseDownloadUrl";

type Props = {
  firebasePath: string;
  className?: string;
  children?: React.ReactNode;
};

export const FirebaseImageDiv = forwardRef<HTMLDivElement, Props>(
  ({ firebasePath, children, ...others }, ref) => {
    const url = useFirebaseDownloadUrl(firebasePath);
    return (
      <div {...others} ref={ref} style={{ backgroundImage: `url(${url})` }}>
        {children}
      </div>
    );
  }
);

FirebaseImageDiv.displayName = "FirebaseImageDiv";
