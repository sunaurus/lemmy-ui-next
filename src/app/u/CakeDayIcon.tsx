import { CakeIcon } from "@heroicons/react/16/solid";

export const CakeDayIcon = (props: { published: string; tooltip?: string }) => {
  const today = new Date();
  const joinDate = new Date(props.published);
  const isCakeDay =
    joinDate.getMonth() === today.getMonth() &&
    joinDate.getDate() == today.getDate();

  if (!isCakeDay) {
    return null;
  }

  return (
    <CakeIcon
      className="h-4 text-amber-500"
      title={props.tooltip ?? "It's this person's cakeday!"}
    />
  );
};
