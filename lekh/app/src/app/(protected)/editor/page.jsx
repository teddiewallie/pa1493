"use client";

import { useState } from "react";
import { CreateArticleForm } from "@/components/create-article-form";

const Page = () => {
  const [ editorValue, editorOnChange ] = useState("");

  return (<CreateArticleForm />);
}

export default Page;

