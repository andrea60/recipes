import { IconProps, LeafIcon, PepperIcon } from "@phosphor-icons/react";
import { match } from "ts-pattern";

type Props = {
  iconName?: string;
} & IconProps;
export const CategoryIcon = ({ iconName, ...rest }: Props) => {
  return match(iconName)
    .with("PepperIcon", () => <PepperIcon {...rest} />)
    .with("LeafIcon", () => <LeafIcon {...rest} />)
    .otherwise(() => null);
};
