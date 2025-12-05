import { IconProps } from "@phosphor-icons/react";
import { match } from "ts-pattern";
import * as Icons from "@phosphor-icons/react";

type Props = {
  iconName?: string;
} & IconProps;
export const CategoryIcon = ({ iconName, ...rest }: Props) => {
  if (!iconName) return null;
  const IconElement = Icons[iconName as keyof typeof Icons] as Icons.Icon;

  return <IconElement {...rest} />;
};
