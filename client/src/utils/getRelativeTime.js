import { formatDistanceToNow } from "date-fns";

export const getRelativeTime = (createdAt) => {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
};
