import { ReactNode } from "react";
import classNames from "classnames";

export type ButtonProps = {
  className?: string;
  disabled?: boolean;
  children: ReactNode | ReactNode[];
  type?: "submit";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "neutral" | "primary";
  onClick?(): void;
};

export const Button = (props: ButtonProps) => {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classNames(
        `flex flex-wrap justify-center rounded border p-1.5 text-${props.size ?? "sm"}
        font-semibold text-white shadow-sm hover:brightness-125 focus-visible:outline
        focus-visible:outline-2 focus-visible:outline-offset-2`,
        props.className,
        {
          "border-neutral-600 bg-neutral-500 focus-visible:outline-neutral-600":
            !props.color || props.color === "neutral",
          "border-primary-600 bg-primary-500 focus-visible:outline-primary-600":
            props.color === "primary",
        },
        { "p-1.5": props.size === "xs" },
      )}
    >
      {props.children}
    </button>
  );
};
