"use client";

import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/login/auth";
import Link from "next/link";
import { Input } from "@/app/_ui/Input";

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
        <Input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="mt-2"
        />
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
            <Link
              href={"/login_reset"}
              className="font-semibold text-slate-500 hover:text-slate-400"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="twofactor"
            className="block text-sm font-medium leading-6"
          >
            2fa code (optional)
          </label>
        </div>
        <Input
          className="mt-2"
          id="twofactor"
          name="twofactor"
          autoComplete="one-time-code"
        />
      </div>

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
