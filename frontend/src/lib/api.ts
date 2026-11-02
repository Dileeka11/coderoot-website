export interface Project {
  slug: string;
  title: string;
  category: { value: string; label: string };
  client: string | null;
  summary: string;
  tech_stack: string[];
  cover: string;
  live_url: string | null;
  year: number | null;
  featured: boolean;
  published_at: string | null;
  updated_at: string | null;
  description?: string;
  gallery?: string[];
}

/**
 * Projects are read in the browser from Laravel on the same domain, so a project added in the
 * admin panel shows up straight away, without building the site again.
 */
async function request<T>(path: string, onNotFound: T): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });

  if (response.status === 404) return onNotFound;
  if (!response.ok) throw new Error(`API responded with ${response.status} for ${path}`);

  const body = (await response.json()) as { data: T };
  return body.data;
}

export function getProjects(): Promise<Project[]> {
  return request<Project[]>("/projects", []);
}

export function getProject(slug: string): Promise<Project | null> {
  return request<Project | null>(`/projects/${encodeURIComponent(slug)}`, null);
}

/** Only ever links out over http or https, whatever is in the database. */
export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
}

/** Upload paths from the API, served through this site's own origin. */
export function mediaUrl(path: string) {
  return `/media/${path.split("/").map(encodeURIComponent).join("/")}`;
}
