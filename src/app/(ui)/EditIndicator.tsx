import { formatDistanceToNowStrict } from "date-fns";

export const EditIndicator = (props: { editTime?: string }) => {
  if (!props.editTime) {
    return null;
  }
  const date = new Date(props.editTime);

  return (
    <div
      className="h-4 -ml-1"
      title={`Edited ${formatDistanceToNowStrict(date, { addSuffix: true })}`}
    >
      *
    </div>
  );
};
