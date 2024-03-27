import { formatDistanceToNowStrict } from "date-fns";

export const EditIndicator = (props: { editTime?: string }) => {
  if (!props.editTime) {
    return null;
  }
  const date = new Date(props.editTime);

  return (
    <div
      className="-ml-1 h-4"
      suppressHydrationWarning={true} // The exact time can differ when rendering on the server vs on the client
      title={`Edited ${formatDistanceToNowStrict(date, { addSuffix: true })}`}
    >
      *
    </div>
  );
};
