"use client";

import { useEffect, useState } from "react";
import { ArticleContext } from "@/context/article-context";



const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);

  return (
    <ArticleContext.Provider value={{articles}}>
      { children }
    </ArticleContext.Provider>
  );
};

export { ArticleProvider };

