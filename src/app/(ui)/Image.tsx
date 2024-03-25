// The Image component from next/image adds inline styles for some reason. This doesn't work with a secure CSP.
// This component attempts to remove inline styles - it doesn't work for all cases
// TODO: check if getImageProps can solve remaining issues.

// eslint-disable-next-line no-restricted-imports
import { default as NextImage, ImageProps } from "next/image";
import classNames from "classnames";

export const Image = (props: ImageProps) => {
  return (
    <NextImage
      {...props}
      className={classNames(
        "bg-transparent",
        { "absolute w-full h-full left-0 right-0 top-0 bottom-0": props.fill },
        props.className,
      )}
      style={{
        color: undefined,
        position: undefined,
        height: undefined,
        width: undefined,
        left: undefined,
        right: undefined,
        top: undefined,
        bottom: undefined,
      }}
    />
  );
};
