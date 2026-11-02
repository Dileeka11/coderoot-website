import { ArticlePage, articleMetadata } from "@/components/insights/ArticlePage";
import { getArticle } from "@/lib/insights";

const article = getArticle("custom-software-or-ready-made");

export const metadata = articleMetadata(article);

export default function Page() {
  return <ArticlePage article={article} />;
}
