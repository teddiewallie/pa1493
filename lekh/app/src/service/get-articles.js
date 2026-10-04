"use server";

import { auth } from "@/auth";
import {
  getArticlesQuery,
  getArticleTypesQuery
} from "@/query/article-query";

const getArticles = async () => {
  const session = await auth();

  if (!session) {
    return [];
  }

  try {
    const capsule = {};
    capsule.articles = await getArticlesQuery();
    capsule.articleTypes = await getArticleTypesQuery();
    return capsule;
  } catch(e) {
    return [];
  }
};

export { getArticles };

