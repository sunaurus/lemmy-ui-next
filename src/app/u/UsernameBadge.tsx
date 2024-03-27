import classNames from "classnames";

export const UsernameBadge = (props: {
  title: string;
  content: string;
  className: string;
}) => {
  return (
    <span
      title={props.title}
      className={classNames(
        "rounded border px-1 text-center font-mono text-[10px]/snug font-bold",
        props.className,
      )}
    >
      {props.content}
    </span>
  );
};
