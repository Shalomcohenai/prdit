const DEFAULT_SITE_URL = "https://prd.it.com";

function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.startsWith("www.")) {
      parsed.hostname = parsed.hostname.slice(4);
    }
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
);

export function absoluteUrl(pathname: string): string {
  if (pathname === "/" || pathname === "") return SITE_URL;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}
