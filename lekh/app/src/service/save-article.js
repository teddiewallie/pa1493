// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

"use server";

import { auth } from "@/auth";
import {
  addArticleQuery,
  updateArticleQuery,
  getArticleByIdQuery,
  getArticlesByIdAndUserIdQuery,
} from "@/query/article-query";
import { createArticleSchema } from "@/schema/article-schema";

const saveArticle = async (data) => {
  const session = await auth();

  if (!session?.user) return false;

  const isMaintainer = session.user.role_id === 1;
  const userId = Number(session.user.id);

  if (!Number.isInteger(userId) || userId <= 0) return false;

  const validation = createArticleSchema().safeParse(data);
  if (!validation.success) return false;

  const article = validation.data;

  try {
    if (!isMaintainer) {
      // Students can only create or edit general articles.
      if (article.itemId != null || article.typeId !== 3) return false;

      // Students may only update articles they own.
      if (article.id) {
        const existingArticle = await getArticlesByIdAndUserIdQuery(
          article.id,
          userId
        );

        if (!existingArticle) return false;
      }
    }

    if (article.id) {
      const existingArticle = await getArticleByIdQuery(article.id);

      if (!existingArticle) return false;

      // Preserve the existing author when updating.
      await updateArticleQuery({
        ...article,
        userId: existingArticle.user_id,
      });

      return true;
    }

    // Always derive the author from the authenticated session.
    return await addArticleQuery({
      ...article,
      userId,
    });
  } catch (e) {
    console.error(e);
    return false;
  }
};

export { saveArticle };

