import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import classNames from "classnames";

export type Props = {};

export const Input = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) => {
  const { className, ...rest } = props;

  return (
    <input
      className={classNames(
        "text-sm rounded block w-full p-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-white focus:ring-slate-500 focus:outline-none focus:border-slate-500 autofill:bg-slate-700",
        className,
      )}
      {...rest}
    />
  );
};
