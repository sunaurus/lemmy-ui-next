import Image from "next/image";
import classNames from "classnames";

export const Avatar = (props: {
  avatarSrc?: string;
  size: "mini" | "regular";
}) => {
  return (
    <div
      className={classNames(`relative`, {
        "h-[20px] w-[20px]": props.size === "mini",
        "h-[100px] w-[100px]": props.size === "regular",
      })}
    >
      <Image
        src={props.avatarSrc ?? "/lemmy-icon-96x96.webp"}
        alt={`Avatar`}
        className="rounded object-cover"
        priority={true}
        fill={true}
        sizes={props.size === "mini" ? "20px" : "100px"}
      />
    </div>
  );
};
