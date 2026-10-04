import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ArticleList = ({ articles, articleTypes }) => {
  const getTypeName = (id) =>
    articleTypes.find((articleType) => articleType.id == id).name;

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
                <Badge className="ml-2">
                  {getTypeName(article.type_id)}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export { ArticleList };


