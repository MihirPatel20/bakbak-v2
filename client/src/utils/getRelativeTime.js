import { format, formatDistanceToNow, startOfDay } from "date-fns";

export const getRelativeTime = (createdAt) => {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
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
