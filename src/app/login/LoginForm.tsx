"use client";

import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/login/auth";

export const LoginForm = () => {
  return (
    <form className="space-y-6" action={loginAction}>
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6"
        >
          E-mail or username
        </label>
        <div className="mt-2">
          <input
            id="username"
            name="username"
            autoComplete="username"
            // required
            className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6"
          >
            Password
          </label>
          <div className="text-sm">
            <a
              href="#"
              className="font-semibold text-slate-500 hover:text-slate-400"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
          />
        </div>
      </div>

      {/*<div>*/}
      {/*  <label*/}
      {/*    htmlFor='twofactor'*/}
      {/*    className='block text-sm font-medium leading-6'*/}
      {/*  >*/}
      {/*    2fa code*/}
      {/*  </label>*/}
      {/*  <div className='mt-2'>*/}
      {/*    <input*/}
      {/*      id='twofactor'*/}
      {/*      name='twofactor'*/}
      {/*      type='twofactor'*/}
      {/*      autoComplete='one-time-code'*/}
      {/*      required*/}
      {/*      className='bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500'*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full justify-center rounded bg-slate-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
    >
      {pending ? "Loading..." : "Sign in"}
    </button>
  );
};
