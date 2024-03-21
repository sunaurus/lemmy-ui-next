const videoRegex = /(http)?s?:?(\/\/[^"']*\.(?:mp4|webm))/;

export const isVideo = (url?: string): url is string => {
  return !!url && videoRegex.test(url);
};
