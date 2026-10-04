"use server";

import { addArticleQuery, updateArticleQuery } from "@/query/article-query";

const saveArticle = async (data) => {
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
