export const getFileExtension = (path: string) => {
  const parts = path.split(".");
  if (parts.length < 2) return undefined;

  return parts[parts.length - 1];
};
