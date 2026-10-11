/**
 * Resolves a relative image path (e.g. 'logos/123.png', 'profiles/456.png')
 * to the full public CDN URL using `VITE_R2_PUBLIC_URL` from environment variables.
 * Preserves full HTTP/HTTPS and Data URLs untouched.
 */
export function resolveImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const base = (import.meta.env.VITE_R2_PUBLIC_URL || "").replace(/\/+$/, "");
  return base ? `${base}/${url.replace(/^\/+/, "")}` : url;
}
