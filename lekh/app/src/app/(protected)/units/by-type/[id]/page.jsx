"use client";

import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { use, useContext, useEffect } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ArticleContext } from "@/context/article-context";
import { ItemList } from "@/components/item-list";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateGroupForm } from "@/components/create-group-form";
import { SimpleCard } from "@/components/simple-card";
import { LinkButton } from "@/components/link-button";
import { ArticleList } from "@/components/article-list";
import { toast } from "@/components/ui/toast";

const Page = ({ params }) => {
  const { id } = use(params);
  const { user } = useContext(UserContext);
  const { groups, refreshGroups, refreshItems } = useContext(EquipmentContext);
  const { articles, articleTypes, refreshArticles } = useContext(ArticleContext);
  const router = useRouter();

  const group = groups.find((group) => group.id == id);

  const filteredArticles = articles.filter(
    (article) => article.group_id == id
  );

  const extraCards = (
    <>
      {filteredArticles.length > 0 && (
        <ArticleList articles={filteredArticles} articleTypes={articleTypes} />
      )}

      {group?.known_issues?.length > 0 && (
        <SimpleCard
          title="Known Type Issues"
          description="Type spanning issues."
          content={group.known_issues}
        />
      )}
    </>
  );

  const isUngrouped = id == 1;

  if (id == 0) {
    redirect("/units");
  }

  useEffect(() => {
    if (!group) {
      router.replace("/types");
    }
  }, [group, router]);

  return (
    <>
      <div className="container md:mx-auto px-10 mt-4 text-2xl font-bold">
        <div className="flex items-center">
          <Link href="/types">
            <CircleArrowLeft className="inline mr-2" />
            {group && group.name}
          </Link>
        </div>
      </div>

      <ItemList extraCards={extraCards} groupId={Number(id)}>
        {!isUngrouped && (
          <LinkButton href={`/editor/for-type/${id}`}>
            Add Article
          </LinkButton>
        )}

        {user.role_id == 1 && (
          <ModalWithToast title="Edit Type" row>
            <CreateGroupForm
              group={group}
              onSuccess={() => {
                toast.add({ title: "Type successfully updated." });
                refreshGroups();
              }}
              onFail={() => {
                toast.add({ title: "Failed to update type." });
              }}
              onDeleteSuccess={() => {
                toast.add({ title: "Type successfully deleted." });
                refreshGroups();
                refreshItems();
                refreshArticles();
                router.replace("/units/by-type/1");
              }}
              onDeleteFail={() => {
                toast.add({ title: "Failed to delete type." });
              }}
            />
          </ModalWithToast>
        )}
      </ItemList>
    </>
  );
};

export default Page;

