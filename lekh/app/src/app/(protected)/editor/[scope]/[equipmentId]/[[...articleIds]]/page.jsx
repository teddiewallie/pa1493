"use client";

import { useRouter } from "next/navigation";
import { use, useContext } from "react";
import { ArticleContext } from "@/context/article-context";
import { CreateArticleForm } from "@/components/create-article-form";
import { toast } from "@/components/ui/toast";

const Page = ({params}) => {
  const router = useRouter();

  const { articles } = useContext(ArticleContext);
  const { scope, equipmentId, articleIds } = use(params);
  let articleId = null;

  const validScopes = ["for-type", "for-unit"];
  if (!validScopes.includes(scope)) {
    router.back();
    return (<div />);
  }

  if (articleIds) {
    if (articleIds.length > 1) {
      router.back();
      return (<div />);
    } else {
      articleId = articleIds[0];
    }
  }

  const groupId = scope === "for-type" ? equipmentId : null;
  const itemId = scope === "for-unit" ? equipmentId : null;

  const article = articles?.find((article) => (article.group_id == groupId || article.item_id == itemId));

  return (<CreateArticleForm {...{
    onSuccess: () => toast.add({ title: "Article successfully saved." }),
    onFail: () => toast.add({ title: "Failed to save article." }),
    article,
    articleId,
    groupId,
    itemId
  }} />);
}

export default Page;

