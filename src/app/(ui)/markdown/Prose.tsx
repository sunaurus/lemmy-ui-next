import { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

// See: https://github.com/tailwindlabs/tailwindcss-typography
export const Prose = (props: Props) => {
  return (
    <div
      className="max-w-full
      min-w-none
      prose
      prose-sm
      prose-invert
      prose-neutral
      hover:prose-a:text-slate-300
      prose-a:text-slate-400
      prose-a:no-underline
      prose-hr:border-neutral-700
      prose-ul:list-disc
      prose-li:leading-snug
      prose-p:leading-snug
      prose-p:mx-0
      prose-p:my-1
      prose-p:break-words"
    >
      {props.children}
    </div>
  );
};
