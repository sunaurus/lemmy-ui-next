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
      <h2 className="text-center">Something went wrong!</h2>
      <div>{JSON.stringify(error)}</div>
      <button
        className="mt-4 rounded-md bg-slate-500 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Take me back
      </button>
    </main>
  );
}
