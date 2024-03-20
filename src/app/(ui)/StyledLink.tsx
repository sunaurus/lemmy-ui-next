import React from "react";
import classNames from "classnames";
import Link, { LinkProps } from "next/link";

type Props = {
  children?: React.ReactNode;
  className?: string;
} & LinkProps &
  React.RefAttributes<HTMLAnchorElement>;

export const StyledLink = (props: Props) => {
  const { className, ...rest } = props;

  return (
    <Link
      className={classNames(
        "hover:brightness-125",
        { "text-slate-400": !className?.includes("text-") },
        className,
      )}
      {...rest}
    />
  );
};
