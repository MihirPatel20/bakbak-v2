import { formatDistanceToNow } from "date-fns";

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
