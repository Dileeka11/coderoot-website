import { ArticlePage, articleMetadata } from "@/components/insights/ArticlePage";
import { getArticle } from "@/lib/insights";

const article = getArticle("website-or-web-app");

export const metadata = articleMetadata(article);

export default function Page() {
  return <ArticlePage article={article} />;
}
