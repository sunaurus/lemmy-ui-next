import { CakeIcon } from "@heroicons/react/16/solid";
import { Person } from "lemmy-js-client";

export const CakeDayIcon = (props: { person: Person }) => {
  const today = new Date();
  const joinDate = new Date(props.person.published);
  const isCakeDay =
    joinDate.getMonth() === today.getMonth() &&
    joinDate.getDate() == today.getDate();

  if (!isCakeDay) {
    return null;
  }

  return (
    <CakeIcon
      className="h-4 text-amber-500"
      title="Today is this user's cakeday!"
    />
  );
};
