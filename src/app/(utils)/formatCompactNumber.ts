const formatter = Intl.NumberFormat("en", {
  notation: "compact",
});
export const formatCompactNumber = formatter.format;
