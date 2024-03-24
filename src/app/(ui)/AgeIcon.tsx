import { CakeIcon, SparklesIcon } from "@heroicons/react/16/solid";

export const AgeIcon = (props: {
  published: string;
  type: "person" | "community";
}) => {
  const today = new Date();
  const joinDate = new Date(props.published);

  const oneWeekMillis = 7 * 24 * 60 * 60 * 1000;
  const isNew = today.valueOf() - joinDate.valueOf() < oneWeekMillis;

  if (isNew) {
    return (
      <SparklesIcon
        className="h-4 text-emerald-500"
        title={props.type === "person" ? `New user!` : `New community!`}
      />
    );
  }

  const isCakeDay =
    joinDate.getMonth() === today.getMonth() &&
    joinDate.getDate() == today.getDate();

  if (isCakeDay) {
    return (
      <CakeIcon
        className="h-4 text-amber-500"
        title={
          props.type === "person"
            ? "It's this person's cakeday!"
            : "Community cakeday!"
        }
      />
    );
  }

  return null;
};
