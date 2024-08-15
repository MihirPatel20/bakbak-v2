export function getUserAvatarUrl(avatar) {
  return (
    avatar?.url ||
    `${import.meta.env.VITE_SERVER_BASE_URI}/${avatar?.localPath}`
  );
}
