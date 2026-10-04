import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

import Link from "next/link";

import { ArticleBadge } from "@/components/article-badge";

const ArticleList = ({ articles, articleTypes }) => {

  return (
    <Card className="max-h-106">
      <CardHeader className="pt-2">
        <CardTitle>
          Articles
        </CardTitle>
        <CardDescription>
          Guides, Documentation, Equipment, Projects
        </CardDescription>
      </CardHeader>

      <CardContent className="overflow-scroll -mb-4 pb-8">
        <ul className="space-y-2">
          {articles.map((article) => (
            <li key={`article-${article.id}`}>
              <Link
                href={`/article/${article.id}`}
                className="cursor-pointer"
              >
                {article.title}
                <ArticleBadge {...{ article, articleTypes }} />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export { ArticleList };


