"use server";

import { apiClient } from "@/app/apiClient";
import {
  GetReportCountResponse,
  GetUnreadCountResponse,
  GetUnreadRegistrationApplicationCountResponse,
} from "lemmy-js-client";

export type UnreadCounts = {
  inbox: GetUnreadCountResponse;
  applications: GetUnreadRegistrationApplicationCountResponse | null;
  reports: GetReportCountResponse | null;
};

export const getUnreadCounts = async (
  isAdmin: boolean,
  isMod: boolean,
  applicationsEnabled: boolean,
): Promise<UnreadCounts> => {
  return {
    inbox: await apiClient.getUnreadCount(),
    applications:
      isAdmin && applicationsEnabled
        ? await apiClient.getUnreadRegistrationApplicationCount()
        : null,
    reports: isAdmin || isMod ? await apiClient.getReportCount({}) : null,
  };
};
