"use client";

import { useFormStatus } from "react-dom";

export const SearchButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-[100px] flex flex-wrap justify-center rounded bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 border border-slate-500"
    >
      {pending ? "Searching..." : "Search"}
    </button>
  );
};
