"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/app/(ui)/button/Button";

type Props = Omit<ButtonProps, "type">;

export const SubmitButton = (props: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending || props.disabled}>
      {pending ? "Working..." : props.children}
    </Button>
  );
};
