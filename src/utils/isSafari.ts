export const isSafari = () => {
  const ua = navigator.userAgent;

  // Safari on macOS, iOS Safari
  return /^((?!chrome|crios|fxios|edg|android).)*safari/i.test(ua);
};
