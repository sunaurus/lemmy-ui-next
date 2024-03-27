"use client";

import { StyledLink } from "@/app/(ui)/StyledLink";
import { EnvelopeIcon, FlagIcon } from "@heroicons/react/16/solid";
import { ClipboardIcon } from "@heroicons/react/20/solid";
import { MyUserInfo } from "lemmy-js-client";
import classNames from "classnames";
import {
  getUnreadCounts,
  UnreadCounts,
} from "@/app/settings/loggedInUserActions";
import { useInterval } from "usehooks-ts";
import { useState } from "react";

export const LoggedInUserIcons = (props: {
  loggedInUser: MyUserInfo;
  applicationsRequired: boolean;
  initialCounts?: UnreadCounts;
}) => {
  const isAdmin = props.loggedInUser.local_user_view.local_user.admin;
  const isMod = props.loggedInUser.moderates.length > 0;
  const isModOrAdmin = isAdmin || isMod;

  const [counts, setCounts] = useState<UnreadCounts | undefined>(
    props.initialCounts,
  );

  useInterval(
    async () => {
      if (!document.hidden) {
        setCounts(
          await getUnreadCounts(isAdmin, isMod, props.applicationsRequired),
        );
      }
    },
    // Delay in milliseconds or null to stop it
    60 * 1000,
  );

  const inboxCount =
    (counts?.inbox.mentions ?? 0) +
    (counts?.inbox.private_messages ?? 0) +
    (counts?.inbox.replies ?? 0);

  const reportCount =
    (counts?.reports?.comment_reports ?? 0) +
    (counts?.reports?.post_reports ?? 0) +
    (counts?.reports?.private_message_reports ?? 0);

  const applicationCount = counts?.applications?.registration_applications ?? 0;

  return (
    <>
      <StyledLink className="text-neutral-300" href={"/inbox"}>
        <EnvelopeIcon
          className={classNames("h-4", { "text-primary-400": inboxCount > 0 })}
        />
      </StyledLink>
      {isModOrAdmin && (
        <StyledLink className="text-neutral-300" href={"/reports"}>
          <FlagIcon
            className={classNames("h-4", {
              "text-primary-400": reportCount > 0,
            })}
          />
        </StyledLink>
      )}
      {isAdmin && props.applicationsRequired && (
        <StyledLink
          className="text-neutral-300"
          href={"/registration_applications"}
        >
          <ClipboardIcon
            className={classNames("h-4", {
              "text-primary-400": applicationCount > 0,
            })}
          />
        </StyledLink>
      )}
    </>
  );
};
