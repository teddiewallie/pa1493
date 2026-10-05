"use client";

import Link from "next/link";
import { useEffect, useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArticleContext } from "@/context/article-context";
import { ArticleRow } from "@/components/article-row";

const Page = () => {
  const [query, setQuery] = useState("");
  const { articles, articleTypes } = useContext(ArticleContext);
  const [results, setResults] = useState([]);

  const updateQuery = (value) => {
    if (value === "") {
      setResults(articles);
      return;
    }

    const newResults = articles.filter((article) => (
      article.title.toLowerCase().includes(value.toLowerCase())
      || article.content.toLowerCase().includes(value.toLowerCase())
    ));

    setResults(newResults);
  };

  useEffect(() => updateQuery(""), [articles]);

  return (
    <>
      <Input
        type="text"
        className="rounded-none !bg-transparent border-x-0 text-center !text-2xl h-16"
        onKeyUp={(e) => updateQuery(e.target.value)}
      />
      <div className="container mx-auto px-4 lg:px-64 mt-4 mb-12">
        <ul className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
          {results.map((result) => <ArticleRow key={`result-${result.id}`} {...{ article: result, articleTypes }} />)}
        </ul>
      </div>
    </>
  );
};

export default Page;

