"use client";

import { useEffect, useState } from "react";
import { ArticleContext } from "@/context/article-context";
import { getArticles } from "@/service/get-articles";

const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [articleTypes, setArticleTypes] = useState([]);

  const refreshArticles = async () => {
    const { articles, articleTypes } = await getArticles();
    setArticles(articles);
    setArticleTypes(articleTypes);
  }

  useEffect(() => {
    const load = async () => await refreshArticles();
    load();
  }, []);
  
  return (
    <ArticleContext.Provider value={{articles, articleTypes}}>
      { children }
    </ArticleContext.Provider>
  );
};

export { ArticleProvider };

