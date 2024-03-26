"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center text-2xl mt-20">Something went wrong!</h2>
      <div>
        Unfortunately, we ran into an issue when trying to display this page.
      </div>
      <div>
        When reporting this to instance admins, please include the error digest
        in your report, as it may be used to find relevant logs on the server.
      </div>
      <div>Error digest: {error.digest}</div>
      <button
        className="mt-4 rounded-md bg-slate-500 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-400"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
