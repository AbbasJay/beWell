const TIME_UNITS = {
  day: 86400,
  hour: 3600,
  minute: 60,
} as const;

function formatGetTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < TIME_UNITS.minute) {
    return "just now";
  }

  const monthsDiff =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());

  if (monthsDiff >= 12) {
    const years = Math.floor(monthsDiff / 12);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }

  if (monthsDiff >= 1) {
    return `${monthsDiff} month${monthsDiff === 1 ? "" : "s"} ago`;
  }

  for (const [unit, seconds] of Object.entries(TIME_UNITS)) {
    const diff = Math.floor(diffInSeconds / seconds);
    if (diff >= 1) {
      return `${diff} ${unit}${diff === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export { formatGetTimeAgo, formatDateTime };
