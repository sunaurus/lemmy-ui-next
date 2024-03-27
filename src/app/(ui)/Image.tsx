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
      src={
        typeof props.src === "string"
          ? props.src.replace("http://", "https://")
          : props.src
      }
      className={classNames(
        "bg-transparent",
        { "absolute bottom-0 left-0 right-0 top-0 h-full w-full": props.fill },
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
