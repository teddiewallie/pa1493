"use client";

import { use, useContext } from "react";
import { ArticleContext } from "@/context/article-context";
import MDEditor from "@uiw/react-md-editor";

const Page = ({params}) => {
  const { id } = use(params);
  const { articles } = useContext(ArticleContext);

  const article = articles.find((article) => article.id == id);

  return (
    <>
      <div className="border-b py-6">
        <div className="text-xl lg:text-4xl font-bold text-center">{article?.title}</div>
      </div>
      <div className="container mx-auto px-10 lg:px-60 py-10">
        <MDEditor.Markdown source={article?.content} style={{ whiteSpace: 'pre-wrap' }} />
      </div>
    </>
  );
};

export default Page;
