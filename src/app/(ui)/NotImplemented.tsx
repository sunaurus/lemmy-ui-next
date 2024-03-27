export const NotImplemented = () => {
  return (
    <div className="flex h-[calc(100vh_-_150px)] flex-col content-center items-center">
      <h1 className="mt-auto text-2xl">Not implemented yet!</h1>

      <div className="mb-auto mt-6 max-w-3xl text-center">
        <p>This frontend (lemmy-ui-next) is under active development.</p>
        <p>
          Unfortunately, the page you opened is not yet finished in this
          project.
        </p>
        <p>
          Please use the default Lemmy UI at{" "}
          <a
            href="https://ui.lemm.ee"
            className="text-primary-400 hover:text-primary-300"
          >
            https://ui.lemm.ee
          </a>{" "}
          for this functionality.
        </p>
      </div>
    </div>
  );
};
