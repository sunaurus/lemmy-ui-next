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
      <h2 className="mt-20 text-center text-2xl">Something went wrong!</h2>
      <div>
        Unfortunately, we ran into an issue when trying to display this page.
      </div>
      {error.digest && (
        <>
          <div>
            When reporting this to instance admins, please include the error
            digest in your report, as it may be used to find relevant logs on
            the server.
          </div>
          <div>Error digest: {error.digest}</div>
        </>
      )}
      <button
        className="bg-primary-500 hover:bg-primary-400 mt-4 rounded-md px-4 py-2 text-sm text-white
          transition-colors"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
