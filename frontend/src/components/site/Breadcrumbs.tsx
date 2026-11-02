import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

/** The trail people can see and the same trail for search engines, from one list. */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <nav aria-label="Breadcrumb" className="rise mb-7 text-sm text-mist">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-white/30">
                  /
                </span>
              )}
              {index === trail.length - 1 ? (
                <span aria-current="page" className="text-white">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="inline-flex min-h-6 items-center transition-colors duration-200 hover:text-teal">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
