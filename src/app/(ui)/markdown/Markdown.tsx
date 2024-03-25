import MarkdownIt from "markdown-it";
import { Prose } from "@/app/(ui)/markdown/Prose";

type Props = {
  content: string;
};
const md = new MarkdownIt({ linkify: true });

export const Markdown = (props: Props) => {
  const renderedHtml = md.render(props.content ?? "");

  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
    </Prose>
  );
};
