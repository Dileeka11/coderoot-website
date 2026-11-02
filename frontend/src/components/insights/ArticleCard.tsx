import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { readingMinutes, type Article } from "@/lib/insights";

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <article className="h-full" data-reveal style={{ "--i": index } as React.CSSProperties}>
      <Link href={`/insights/${article.slug}`} data-tilt className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7">
        <span className="text-sm font-semibold text-teal-deep">
          {article.category} · {readingMinutes(article)} min read
        </span>
        <h3 className="mt-3 text-2xl">{article.title}</h3>
        <span className="mb-5 mt-3 flex-1 text-slate">{article.summary}</span>
        <span className="inline-flex items-center gap-2 font-semibold">
          Read article
          <ArrowRight className="arrow size-[18px] text-teal-deep" />
        </span>
      </Link>
    </article>
  );
}
