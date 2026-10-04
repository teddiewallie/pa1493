"use client";

import { useRouter } from "next/navigation";
import { use, useContext } from "react";
import { ArticleContext } from "@/context/article-context";
import { UserContext } from "@/context/user-context";
import { CreateArticleForm } from "@/components/create-article-form";
import { toast } from "@/components/ui/toast";

const Page = ({params}) => {
  const router = useRouter();

  const { articles, articleTypes, refreshArticles, loading } = useContext(ArticleContext);
  const { user } = useContext(UserContext);
  const { scope, equipmentId, articleIds } = use(params);
  let articleId = null;

  if (articleIds) {
    if (articleIds.length > 1) {
      router.back();
      return (<div />);
    } else {
      articleId = articleIds[0];
    }
  }

  const groupId = scope === "for-type" ? Number(equipmentId) : null;
  const itemId = scope === "for-unit" ? Number(equipmentId) : null;

  const article = articles?.find((article) => article.id == articleId);

  if (articleId && !article && !loading) {
    router.back();
  }

  const validScopes = ["for-type", "for-unit"];

  if (!validScopes.includes(scope)) {
    router.back();
  }

  if (user.role_id > 1) {
    if (scope == "for-unit") {
      router.back();
    }

    if (article && user.id != article?.user_id) {
      router.back();
    }
  }

  const typeId = user.role_id > 1 ? 3 : Number(article?.type_id);

  return (<CreateArticleForm {...{
    onSuccess: (result) => {
      toast.add({ title: `Article successfully ${articleId ? "updated" : "saved"}.` }),
      refreshArticles();
      if (!articleId) {
        router.push(`/editor/${scope}/${equipmentId}/${result.id}`);
      }
    },
    onFail: () => toast.add({ title: "Failed to save article." }),
    articleTypes: articleTypes ?? [],
    article,
    articleId: Number(articleId),
    groupId,
    itemId,
    typeId,
    userId: Number(user?.id),
    isStudent: user?.role_id > 1
  }} />);
}

export default Page;

