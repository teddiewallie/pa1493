"use client";

import { useEffect, useState } from "react";
import { ArticleContext } from "@/context/article-context";
import { getArticles } from "@/service/get-articles";

const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [articleTypes, setArticleTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshArticles = async () => {
  setLoading(true);

    try {
      const { articles, articleTypes } = await getArticles();
      setArticles(articles);
      setArticleTypes(articleTypes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => await refreshArticles();
    load();
  }, []);
  
  return (
    <ArticleContext.Provider value={{articles, articleTypes, refreshArticles, loading}}>
      { children }
    </ArticleContext.Provider>
  );
};

export { ArticleProvider };

