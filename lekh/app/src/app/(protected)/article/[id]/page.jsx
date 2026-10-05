"use client";

import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { use, useContext } from "react";
import { ArticleContext } from "@/context/article-context";
import { UserContext } from "@/context/user-context";
import MDEditor from "@uiw/react-md-editor";

const Page = ({params}) => {
  const { user } = useContext(UserContext);
  const { id } = use(params);
  const { articles } = useContext(ArticleContext);

  const article = articles.find((article) => article.id == id);

  const href = article?.item_id
    ? `/editor/for-unit/${article?.item_id}/${article?.id}`
    : `/editor/for-type/${article?.group_id}/${article?.id}`;

  const backHref = article?.item_id
    ? `/units/by-id/${article?.item_id}`
    : `/units/by-type/${article?.group_id}`;

  const canEdit = user?.id == article?.user_id || user.role_id == 1;

  return (
    <>
      <div className="border-b py-6">
        <Link
          className="text-xl lg:text-4xl font-bold cursor-pointer flex items-center justify-center"
          href={backHref}
        >
          <CircleArrowLeft className="inline mr-2" />
          {article?.title}
        </Link>
      </div>
      <div className="container mx-auto px-10 lg:px-60 py-10">
        { canEdit &&
          <Link {...{ href }}>
            <Button className="mb-6">Edit Article</Button>
          </Link> }
        <MDEditor.Markdown source={article?.content} style={{ whiteSpace: 'pre-wrap' }} />
      </div>
    </>
  );
};

export default Page;

