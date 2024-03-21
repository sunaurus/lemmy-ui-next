const imageRegex =
  /(http)?s?:?(\/\/[^"']*\.(?:jpg|jpeg|gif|png|svg|webp|avif))/;

export const isImage = (url?: string): url is string => {
  return !!url && imageRegex.test(url);
};
