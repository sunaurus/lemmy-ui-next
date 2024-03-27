"use client";

import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/login/auth";
import { Input } from "@/app/(ui)/form/Input";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { SubmitButton } from "@/app/(ui)/button/SubmitButton";

export const LoginForm = (props: { redirect?: string }) => {
  return (
    <form className="space-y-6" action={loginAction.bind(null, props.redirect)}>
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
            <StyledLink href={"/login_reset"} className="font-semibold">
              Forgot password?
            </StyledLink>
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
        <SubmitButton color={"neutral"} className={"w-full leading-6"}>
          Sign in
        </SubmitButton>
      </div>
    </form>
  );
};

const SubmitButton2 = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary-500 hover:bg-primary-400 focus-visible:outline-primary-500 flex
        w-full justify-center rounded px-3 py-1.5 text-sm font-semibold leading-6
        text-white shadow-sm focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2"
    >
      {pending ? "Loading..." : "Sign in"}
    </button>
  );
};
