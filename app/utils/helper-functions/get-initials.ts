export const getInitials = (name: string): string => {
  if (!name || typeof name !== "string") return "U";

  const trimmedName = name.trim();
  if (trimmedName.length === 0) return "U";

  const names = trimmedName.split(" ").filter((part) => part.length > 0);

  if (names.length === 0) return "U";
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
