"use server";

import { auth } from "@/auth";
import { addArticleQuery, updateArticleQuery } from "@/query/article-query";

const saveArticle = async (data) => {
  const session = await auth(); 

  if (!session) {
    return false;
  }

  if (session.role_id > 1) {
    if (data.itemId) {
      return false;
    }

    if (data.articleType != 3) {
      return false;
    }
  }

  try {
    if (data.id) {
      await updateArticleQuery(data);
      return true;
    } else {
      return await addArticleQuery(data);
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

export { saveArticle };

