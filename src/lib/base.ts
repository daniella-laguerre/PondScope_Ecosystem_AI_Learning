/** Join a site path to Astro `BASE_URL` (always with a trailing slash). */
export function withBase(path = ""): string {
  const root = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${root}${path.replace(/^\//, "")}`;
}
