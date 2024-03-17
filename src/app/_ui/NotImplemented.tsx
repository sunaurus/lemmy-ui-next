export const NotImplemented = () => {
  return (
    <div className="h-[calc(100vh_-_150px)] flex items-center content-center flex-col">
      <h1 className="text-2xl mt-auto">Not implemented yet!</h1>

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
            className="text-slate-400 hover:text-slate-300"
          >
            https://ui.lemm.ee
          </a>{" "}
          for this functionality.
        </p>
      </div>
    </div>
  );
};
