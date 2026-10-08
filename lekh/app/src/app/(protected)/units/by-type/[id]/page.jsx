"use client";

import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
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

  const group = groups.find((group) => (group.id == id));
  const [ message, setMessage ] = useState("");

  const onMessageHandled = () => setMessage("");
  const filteredArticles = articles.filter((article) => (article.group_id == id));

  const extraCards = (
    <>
      { filteredArticles.length > 0 && <ArticleList {...{ articles: filteredArticles, articleTypes }} /> }
      { group?.known_issues.length > 0 &&
          <SimpleCard{...{ title: "Known Type Issues", description: "Type spanning issues.", content: group?.known_issues }} /> }
    </>
  );

  const isUngrouped = id == 1;

  if (id == 0) {
    redirect("/units");
  }

  return (
    <>
      <div className="container md:mx-auto px-10 mt-4 text-2xl font-bold">
        <div className="flex items-center">
          <Link href={`/types`}><CircleArrowLeft className="inline mr-2" />{group && group.name}</Link>
        </div>
      </div>

      <ItemList {...{ extraCards, groupId: Number(id),onMessageHandled }}>
        { !isUngrouped &&
          <Link href={`/editor/for-type/${id}`}>
            <Button
              className="ml-auto mt-4 ml-10 print:hidden"
              variant="outline"
            >Add Article</Button>
          </Link>
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

