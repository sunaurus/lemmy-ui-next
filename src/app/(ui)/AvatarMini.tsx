import Image from "next/image";

export const AvatarMini = (props: { avatarSrc?: string }) => {
  return (
    <div className="relative h-[20px] w-[20px]">
      <Image
        src={props.avatarSrc ?? "/lemmy-icon-96x96.webp"}
        alt={`Avatar`}
        className="rounded object-cover"
        fill={true}
        sizes="20px"
      />
    </div>
  );
};
