import { formatDistanceToNowStrict } from "date-fns";

type Props = {
  /**
   * Time string from Lemmy API
   */
  timeString: string;
  className?: string;
};

export const FormattedTimestamp = (props: Props) => {
  const date = new Date(props.timeString);
  const formatted = formatDistanceToNowStrict(date, {
    addSuffix: true,
  });

  return (
    <time
      className={props.className}
      dateTime={props.timeString}
      suppressHydrationWarning={true} // The exact time can differ when rendering on the server vs on the client
      title={date.toLocaleString()}
    >
      {formatted}
    </time>
  );
};
