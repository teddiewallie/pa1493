import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

import { ArticleRow } from "@/components/article-row";

const ArticleList = ({ articles, articleTypes, title }) => {

  title = title ?? "Articles";

  return (
    <Card className="max-h-106">
      <CardHeader className="pt-2">
        <CardTitle>
          {title}
        </CardTitle>
        <CardDescription>
          Guides, Documentation, Equipment, Projects
        </CardDescription>
      </CardHeader>

    <CardContent className="overflow-scroll -mb-4 pb-8">
      <ul className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
        {articles.map((article) => (
          <ArticleRow
            key={`article-${article.id}`}
            {...{ article, articleTypes }}
          />
        ))}
      </ul>
    </CardContent>
    </Card>
  );
};

export { ArticleList };


