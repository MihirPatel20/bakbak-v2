export function getUserAvatarUrl(avatar) {
  if (avatar?.localPath !== "") {
    return `${import.meta.env.VITE_SERVER_BASE_URI}/${avatar?.localPath}`;
  } else {
    return avatar?.url;
  }
}
