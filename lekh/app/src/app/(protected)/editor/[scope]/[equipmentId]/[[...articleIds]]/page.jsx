"use client";

import { useRouter } from "next/navigation";
import { use, useContext } from "react";
import { ArticleContext } from "@/context/article-context";
import { UserContext } from "@/context/user-context";
import { CreateArticleForm } from "@/components/create-article-form";
import { toast } from "@/components/ui/toast";

const Page = ({params}) => {
  const router = useRouter();

  const { articles, articleTypes } = useContext(ArticleContext);
  const { user } = useContext(UserContext);
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

  const article = articles?.find((article) => article.id == articleId);

  return (<CreateArticleForm {...{
    onSuccess: () => toast.add({ title: "Article successfully saved." }),
    onFail: () => toast.add({ title: "Failed to save article." }),
    articleTypes: articleTypes ?? [],
    article,
    articleId,
    groupId,
    itemId,
    userId: user?.id
  }} />);
}

export default Page;

