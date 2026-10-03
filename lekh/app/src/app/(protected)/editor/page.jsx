"use client";

import { useState, useEffect } from "react";
import { CreateArticleForm } from "@/components/create-article-form";
import { toast } from "@/components/ui/toast";

const Page = () => {
  const [ editorValue, editorOnChange ] = useState("");
  const [ message, setMessage ] = useState("");

  return (<CreateArticleForm {...{
    onSuccess: () => toast.add({ title: "Article successfully saved." }),
    onFail: () => toast.add({ title: "Failed to save article." })
  }} />);
}

export default Page;

