"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArticleContext } from "@/context/article-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ArticleRow } from "@/components/article-row";
import { Badge } from "@/components/badge";

const Page = () => {
  const [query, setQuery] = useState("");

  const { articles, articleTypes } = useContext(ArticleContext);
  const { items, groups } = useContext(EquipmentContext);

  const normalizedQuery = query.toLowerCase();

  const articleResults = articles.filter((article) => (
    article.title.toLowerCase().includes(normalizedQuery)
    || article.content.toLowerCase().includes(normalizedQuery)
  ));

  const itemResults = items.filter((item) => (
    item.name.toLowerCase().includes(normalizedQuery)
    || item.serial.toLowerCase().includes(normalizedQuery)
    || item.shelf.toLowerCase().includes(normalizedQuery)
  ));

  const groupResults = groups.filter((group) => (
    group.name.toLowerCase().includes(normalizedQuery)
  ));

  const ItemRow = ({ item }) => (
    <>
      <Badge {...{ label: "Unit", type: "item" }} />
      <Link href={`/units/by-id/${item.id}`}>
        {`${item.name} - ${item.serial}`}
      </Link>
    </>
  );

  const GroupRow = ({ group }) => (
    <>
      <Badge {...{ label: "Type", type: "group" }} />
      <Link href={`/units/by-type/${group.id}`}>
        {group.name}
      </Link>
    </>
  );

  return (
    <>
      <Input
        type="text"
        value={query}
        className="rounded-none !bg-transparent border-x-0 text-center !text-1xl h-12"
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="container mx-auto px-4 lg:px-64 mt-4 mb-12">
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
          {articleResults.map((article) => (
            <ArticleRow
              key={`result-${article.id}`}
              {...{ article, articleTypes }}
            />
          ))}

          {groupResults.map((group) => (
            <GroupRow key={`result-${group.id}`} {...{ group }} />
          ))}

          {itemResults.map((item) => (
            <ItemRow key={`result-${item.id}`} {...{ item }} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;

