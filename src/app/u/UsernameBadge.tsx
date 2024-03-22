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
        "font-mono rounded border text-[10px]/snug px-1 text-center font-bold",
        props.className,
      )}
    >
      {props.content}
    </span>
  );
};
