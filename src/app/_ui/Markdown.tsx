import MarkdownIt from "markdown-it";

type Props = {
  content: string;
};
const md = new MarkdownIt();

export const Markdown = (props: Props) => {
  const renderedHtml = md.render(props.content ?? "");

  return (
    <div
      className="max-w-none
      prose
      prose-sm
      dark:prose-invert
      prose-neutral
      hover:prose-a:text-slate-300
      prose-a:text-slate-400
      prose-hr:border-neutral-700
      prose-ul:list-disc
      prose-li:leading-snug
      prose-p:leading-snug
      prose-p:mx-0
      prose-p:my-1"
    >
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
    </div>
  );
};
