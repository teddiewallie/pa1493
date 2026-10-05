import Link from "next/link";
import { Badge } from "@/components/badge";

const ArticleRow = ({ article, articleTypes }) => (
  <>
    <Badge {...{ article, articleTypes }} />

    <Link
      href={`/article/${article.id}`}
      className="cursor-pointer"
    >
      {article.title}
    </Link>
  </>
);

export { ArticleRow };
