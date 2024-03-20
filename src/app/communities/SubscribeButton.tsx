"use client";
import {
  subscribeAction,
  unsubscribeAction,
} from "@/app/communities/subscribeActions";
import { MyUserInfo, SubscribedType } from "lemmy-js-client";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/app/(ui)/Spinner";

export const SubscribeButton = (props: {
  loggedInUser: MyUserInfo | undefined;
  currentStatus: SubscribedType;
  communityId: number;
}) => {
  const { pending } = useFormStatus();

  if (!props.loggedInUser) {
    return null;
  }

  if (pending) {
    return <Spinner />;
  }

  switch (props.currentStatus) {
    case "Subscribed":
      return (
        <form action={unsubscribeAction.bind(null, props.communityId)}>
          <button type="submit" className="text-rose-400 hover:brightness-125">
            Unsubscribe
          </button>
        </form>
      );
    case "NotSubscribed":
      return (
        <form action={subscribeAction.bind(null, props.communityId)}>
          <button
            type="submit"
            className="text-emerald-400 hover:brightness-125"
          >
            Subscribe
          </button>
        </form>
      );
    case "Pending":
      return (
        <form action={unsubscribeAction.bind(null, props.communityId)}>
          Pending... (
          <button type="submit" className="text-rose-400 hover:brightness-125">
            cancel
          </button>
          )
        </form>
      );
  }
};
