"use server";

import { redirect } from "next/navigation";
import { SearchPageSearchParams } from "@/app/search/page";

export const searchAction = async (
  searchParams: SearchPageSearchParams,
  data: FormData,
) => {
  const { page: _, q: __, ...oldSearchParams } = searchParams;

  const q = data.get("q")?.toString() ?? undefined;

  let newSearchParamsInput = {
    ...oldSearchParams,
  } as Record<string, string>;

  if (q) {
    newSearchParamsInput = { ...newSearchParamsInput, q };
  }

  const newSearchParams = new URLSearchParams(newSearchParamsInput).toString();
  redirect(`/search?${newSearchParams}`);
};
