import Link from "next/link";
import { JsonLd, organizationId } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { SimpleCta } from "@/components/site/SimpleCta";
import { ButtonLink, ExternalButton } from "@/components/ui/Button";
import { Check, WhatsApp } from "@/components/ui/icons";
import { articles, formatDate, readingMinutes, type Article, type ArticleBlock } from "@/lib/insights";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export function articleMetadata(article: Article) {
  return pageMetadata({
    title: article.title,
    description: article.summary,
    path: `/insights/${article.slug}`,
    type: "article",
  });
}

function Block({ block }: { block: ArticleBlock }) {
  if (block.type === "ul") {
    return (
      <ul className="mt-4 space-y-3">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 text-lg leading-relaxed text-slate">
            <Check className="mt-1.5 size-5 flex-none text-teal-deep" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "h2") return <h2 className="mt-10 text-2xl sm:text-3xl">{block.text}</h2>;
  return <p className="mt-4 text-lg leading-relaxed text-slate">{block.text}</p>;
}

export function ArticlePage({ article }: { article: Article }) {
  const path = `/insights/${article.slug}`;
  const others = articles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.summary,
          url: `${site.url}${path}`,
          mainEntityOfPage: `${site.url}${path}`,
          image: `${site.url}/images/og.png`,
          datePublished: article.published,
          dateModified: article.published,
          inLanguage: "en",
          author: { "@id": organizationId },
          publisher: { "@id": organizationId },
        }}
      />

      <PageHero
        eyebrow={article.category}
        title={article.title}
        crumbs={[
          { name: "Insights", path: "/insights" },
          { name: article.title, path },
        ]}
      >
        {article.summary}
      </PageHero>

      <section className="section-y !pt-8 sm:!pt-12">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
          <article className="min-w-0 max-w-3xl">
            <p className="text-sm text-slate">
              <time dateTime={article.published}>{formatDate(article.published)}</time> · {readingMinutes(article)} min read · By{" "}
              {site.name}
            </p>
            {article.blocks.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </article>

          <aside className="h-fit space-y-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
            <div className="rounded-2xl bg-teal-light p-7">
              <h2 className="text-2xl">Want a straight answer for your business?</h2>
              <p className="mt-2 text-charcoal">Tell us what you need. The quote is free, and there is no pressure.</p>
              <div className="mt-5 grid gap-3">
                <ButtonLink href="/quote" variant="dark" arrow>
                  Get a free quote
                </ButtonLink>
                <ExternalButton href={site.whatsapp.href} variant="outlineDark">
                  <WhatsApp className="size-5" />
                  WhatsApp us
                </ExternalButton>
              </div>
            </div>

            <nav aria-label="More articles" className="rounded-2xl border border-line p-7">
              <h2 className="text-xl">Keep reading</h2>
              <ul className="mt-3 divide-y divide-line">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/insights/${item.slug}`} className="block py-3 font-medium transition-colors duration-200 hover:text-teal-deep">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      <SimpleCta />
    </>
  );
}
