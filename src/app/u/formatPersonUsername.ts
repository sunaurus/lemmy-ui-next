import { Person } from "lemmy-js-client";

export const formatPersonUsername = (
  person: Person,
  ignoreDisplayName?: boolean,
) => {
  const name = ignoreDisplayName
    ? person.name
    : person.display_name ?? person.name;
  return `${name}@${new URL(person.actor_id).host}`;
};
