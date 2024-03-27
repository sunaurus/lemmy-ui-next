import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import classNames from "classnames";

export type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export const TextArea = (props: Props) => {
  const { className, ...rest } = props;

  return (
    <textarea
      className={classNames(
        `autofill:bg-primary-700 focus:border-primary-500 focus:ring-primary-500 block
        w-full rounded border border-neutral-600 bg-neutral-700 p-2 text-sm text-white
        placeholder-neutral-400 focus:outline-none`,
        className,
      )}
      {...rest}
    />
  );
};
