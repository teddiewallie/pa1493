import { Badge } from "@/components/ui/badge";

const badgeColor = [
  "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
];

const ArticleBadge = ({article, articleTypes}) => {
  const getTypeName = (id) => articleTypes
    .find((articleType) => articleType.id == id).name;
                  
  return (<Badge className={`ml-2 ${badgeColor[article.type_id]}`}>{getTypeName(article.type_id)}</Badge>);
};

export { ArticleBadge };

