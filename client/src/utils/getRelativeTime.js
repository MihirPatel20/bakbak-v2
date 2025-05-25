import { format, formatDistanceToNow, startOfDay } from "date-fns";

export const getRelativeTime = (createdAt) => {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date); // in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  if (minutes < 60) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  if (hours < 24) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (days < 7) {
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }

  if (days < 365) {
    const remainingDays = days % 7;
    return `${weeks}w${remainingDays ? ` ${remainingDays}d` : ""}`;
  }

  const remainingWeeks = (days % 365) / 7;
  return `${years}y${
    remainingWeeks >= 1 ? ` ${Math.floor(remainingWeeks)}w` : ""
  }`;
};

export const renderDateLabel = (dateString) => {
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");
  const yesterday = format(
    startOfDay(new Date(new Date().setDate(new Date().getDate() - 1))),
    "yyyy-MM-dd"
  );

  const messageDate = format(startOfDay(new Date(dateString)), "yyyy-MM-dd");

  if (messageDate === today) return "Today";
  if (messageDate === yesterday) return "Yesterday";
  return format(new Date(dateString), "MMMM dd, yyyy");
};
