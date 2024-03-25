import { unstable_cache } from "next/cache";
import "server-only";
import sharp from "sharp";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

export const getRemoteImageProps = unstable_cache(
  async (
    src: string,
    renderedWidth?: number,
    fill?: boolean,
  ): Promise<RemoteImageProps> => {
    const resize = 16;

    try {
      const imageRes = await fetch(src, {
        next: {
          // Cache image response data for 5 days
          revalidate: 3600 * 24 * 5,
        },
      });

      const buffer = await imageRes.arrayBuffer();
      const image = sharp(buffer).rotate();
      let metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error("Unable to get image metadata!");
      }

      if (renderedWidth && renderedWidth < metadata.width) {
        const ratio = metadata.width / renderedWidth;
        metadata = {
          ...metadata,
          width: renderedWidth,
          height: Math.round(metadata.height / ratio),
        };
      }

      if (!metadata.width || !metadata.height) {
        throw new Error("Unable to get image metadata!");
      }

      const resized = image
        .resize(
          ...(Array.isArray(resize)
            ? resize
            : [
                Math.min(metadata.width, resize),
                Math.min(metadata.height, resize),
                { fit: "inside" },
              ]),
        )
        .blur();

      const output = resized.webp({
        quality: 20,
        alphaQuality: 20,
        smartSubsample: true,
      });

      const { data, info } = await output.toBuffer({ resolveWithObject: true });

      return {
        // src: `data:image/webp;base64,${data.toString("base64")}`,
        src,
        placeholder: `data:image/webp;base64,${data.toString("base64")}`,
        ...(fill
          ? { fill: true, sizes: `${renderedWidth} px` }
          : {
              width: metadata.width,
              height: metadata.height,
            }),
      };
    } catch (e) {
      return {
        src,
        height: renderedWidth ?? 200,
        width: renderedWidth ?? 200,
        placeholder: "empty",
        sizes: `${renderedWidth} px`,
        unoptimized: true,
      };
    }
  },
  ["image_metadata_cache"],
  {
    // Cache computed metadata for 5 days
    revalidate: 3600 * 24 * 5,
  },
);

type BaseProps = {
  src: string;
  placeholder: PlaceholderValue;
  unoptimized?: boolean;
};

export type RemoteImageSizeProps = {
  width: number;
  height: number;
};
export type RemoteImageProps = BaseProps &
  (RemoteImageSizeProps | { fill: true; sizes: string });
