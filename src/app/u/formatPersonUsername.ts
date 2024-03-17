import { Person } from "lemmy-js-client";

export const formatPersonUsername = (person: Person) =>
  `${person.display_name ?? person.name}@${new URL(person.actor_id).host}`;
