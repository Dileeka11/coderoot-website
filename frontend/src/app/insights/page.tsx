import { ArticleCard } from "@/components/insights/ArticleCard";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { SimpleCta } from "@/components/site/SimpleCta";
import { articles } from "@/lib/insights";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights: Plain Language Guides for Business Owners",
  description:
    "Plain language guides from CodeRoot Solutions on planning, buying and looking after websites and software, written for business owners.",
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="Insights" title="Plain language guides for business owners" crumbs={[{ name: "Insights", path: "/insights" }]} shapes={["sheet"]}>
        How to plan, buy and look after websites and software, without the jargon. Useful whether you work with us or not.
      </PageHero>

      <section className="section-y" aria-labelledby="articles-heading">
        <div className="shell">
          <SectionHead id="articles-heading" eyebrow="Latest" title="Read before you spend" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} index={index % 3} />
            ))}
          </div>
        </div>
      </section>

      <SimpleCta title="Have a question we have not covered?" />
    </>
  );
}
