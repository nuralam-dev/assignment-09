// Support both a backend origin and the existing origin + /api configuration.
export function getApiBaseUrl(value = process.env.NEXT_PUBLIC_API_URL) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    const path = url.pathname.replace(/\/+$/, "");
    if (!["http:", "https:"].includes(url.protocol)
      || url.username || url.password || url.search || url.hash
      || (path !== "" && path !== "/api")) return null;

    return `${url.origin}/api`;
  } catch {
    return null;
  }
}
