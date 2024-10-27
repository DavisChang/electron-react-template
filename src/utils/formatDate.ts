// From preload
const locate = window.context.locate || "en-US";

const dateFormatter = new Intl.DateTimeFormat(locate, {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "UTC",
});

export const formatDateFromMs = (ms: number) => dateFormatter.format(ms);
