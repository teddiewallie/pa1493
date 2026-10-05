import Link from "next/link";
import { ArticleBadge } from "@/components/article-badge";

const ArticleRow = ({ article, articleTypes }) => (
  <>
    <ArticleBadge {...{ article, articleTypes }} />

    <Link
      href={`/article/${article.id}`}
      className="cursor-pointer"
    >
      {article.title}
    </Link>
  </>
);

export { ArticleRow };
