export function getUserAvatarUrl(avatar) {
  if (!avatar?.url && !avatar?.localPath) {
    return `${
      import.meta.env.VITE_SERVER_BASE_URI
    }/images/default/placeholder-image.jpg`;
  }
  return (
    avatar?.url ||
    `${import.meta.env.VITE_SERVER_BASE_URI}/${avatar?.localPath}`
  );
}
