"use client";

import { useRouter } from "next/navigation";
import { use, useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ArticleContext } from "@/context/article-context";
import { ItemList } from "@/components/item-list";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateGroupForm } from "@/components/create-group-form";
import { SimpleCard } from "@/components/simple-card";
import { Button } from "@/components/ui/button";
import { ArticleList } from "@/components/article-list";

const Page = ({params}) => {
  const { id } = use(params);
  const { user } = useContext(UserContext);
  const { groups, refreshGroups } = useContext(EquipmentContext);
  const { articles, articleTypes } = useContext(ArticleContext);

  const router = useRouter();

  const group = groups.find((group) => (group.id == id));

  const [ message, setMessage ] = useState("");

  const onMessageHandled = () => setMessage("");

  const handleArticleClick = (id) => router.push(`/article/${id}`);

  const filteredArticles = articles.filter((article) => (article.group_id == id));

  console.log(filteredArticles);

  const extraCards = (
    <>
      <ArticleList {...{ articles: filteredArticles, articleTypes, handleClick: handleArticleClick }} />
      <SimpleCard {...{ title: "Known Type Issues", description: group?.known_issues }} />
    </>
  );

  const isUngrouped = id == 1;

  return (
    <>
      <div className="container md:mx-auto pl-10 mt-4 text-2xl font-bold">
        {group && group.name}
      </div>

      <ItemList {...{ extraCards, groupId: Number(id) }}>
        { (user?.role_id == 1 && !isUngrouped) &&
          <Button
            className="ml-auto mt-4 ml-10 print:hidden"
            variant="outline"
            onClick={() => router.push(`/editor/for-type/${id}`)}
          >Add Article</Button>
        }
        { (user.role_id == 1) && <ModalWithToast row {...{ title: "Edit Type", message, onMessageHandled }}>
          <CreateGroupForm {...{
            group,
            onSuccess: () => {
              setMessage("Type successfully updated.");
              refreshGroups();
            },
            onFail: () => setMessage("Failed to update type."),
          }} />
        </ModalWithToast> }
      </ItemList>
    </>
  );
};

export default Page;
