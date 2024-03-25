"use client";

import { createPortal } from "react-dom";
import { ReactNode, useEffect, useState } from "react";

export const MarkdownImageReplacement = (props: {
  selector: string;
  children: ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const containerElement = document.getElementById(props.selector);

  if (!containerElement) {
    return null;
  }

  return createPortal(props.children, containerElement);
};
