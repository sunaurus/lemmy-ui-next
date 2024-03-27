import { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

// See: https://github.com/tailwindlabs/tailwindcss-typography
export const Prose = (props: Props) => {
  return (
    <div
      className="min-w-none prose-a:text-primary-400 hover:prose-a:text-primary-300 prose
        prose-sm prose-neutral prose-invert max-w-full prose-p:mx-0 prose-p:my-1
        prose-p:break-words prose-p:leading-snug prose-a:no-underline prose-ul:list-disc
        prose-li:leading-snug prose-hr:border-neutral-700"
    >
      {props.children}
    </div>
  );
};
