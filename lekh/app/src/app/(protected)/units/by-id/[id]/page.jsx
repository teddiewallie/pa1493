"use client";

import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ArticleContext } from "@/context/article-context";
import { ItemCard } from "@/components/item-card";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";
import { ReportItemForm } from "@/components/report-item-form";
import { SimpleCard } from "@/components/simple-card";
import { Button } from "@/components/ui/button";
import { ArticleList } from "@/components/article-list";
import { ReservationCard } from "@/components/reservation-card";

const Page = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();

  const { user } = useContext(UserContext);
  const { items, refreshItems, meta, groups } = useContext(EquipmentContext);
  const { articles, articleTypes } = useContext(ArticleContext);

  const [editMessage, setEditMessage] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  const item = items?.find((item) => (item.id == id));
  const group = groups?.find((group) => group.id == item?.group_id);

  const onMessageHandled = () => {
    setEditMessage("");
    setReportMessage("");
  }

  const itemIssues = item?.known_issues;
  const groupIssues = group?.known_issues;

  const itemArticles = articles.filter((article) => (article.item_id == item?.id));
  const groupArticles = articles.filter((article) => (article.group_id == item?.group_id));

  return (
    <>
      <div className="container pl-10 md:mx-auto mt-4 text-2xl font-bold">
        <div className="flex items-center">
          <Link href={`/units/by-type/${item?.group_id}`}>
            <CircleArrowLeft className="inline mr-2" />
            {group && group.name} /
            {item && ` ${item.name} - ${item.serial}`}
          </Link>
        </div>
      </div>
      <div className="flex container md:mx-auto">
        { user.role_id == 1 && <Link href={`/editor/for-unit/${id}`}>
            <Button
              className="ml-10 mt-4 print:hidden"
              variant="outline"
            >Add Article</Button>
          </Link>}
        <ModalWithToast noContainer {...{ title: "Report Issue", message: reportMessage, onMessageHandled }}>
          <ReportItemForm {...{
            item,
            onSuccess: () => {
              setReportMessage("Successfully reported item.");
              refreshItems();
            },
            onFail: () => setReportMessage("Failed to report item.")
          }} />
        </ModalWithToast>
        { (user.role_id == 1) && <ModalWithToast noContainer {...{ title: "Edit Unit", message: editMessage, onMessageHandled }}>
          <CreateItemForm {...{
            item,
            onSuccess: () => {
              setEditMessage("Item successfully edited.");
              refreshItems();
            },
            onFail: () => setEditMessage("Failed to edit item."),
            statuses: meta?.status
          }} />
        </ModalWithToast> }
      </div>

      <div className="container px-10 md:mx-auto grid grid-cols-1 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4">
        <ItemCard {...{ item, single: true }} />
        {itemArticles?.length > 0 && <ArticleList {...{ articles: itemArticles, articleTypes, title: "Unit Articles"}} />}
        {groupArticles?.length > 0 && <ArticleList {...{ articles: groupArticles, articleTypes, title: "Type Articles"}} />}
        {itemIssues?.length > 0 && <SimpleCard {...{ title: "Known Unit Issues", description: "Unit specific issues.", content: itemIssues }} />}
        {groupIssues?.length > 0 && <SimpleCard {...{ title: "Known Type Issues", description: "Type spanning issues.", content: groupIssues }} />}
        { Boolean(item?.borrowable) && <ReservationCard {...{ item, type: "borrow" }} /> }
        { Boolean(item?.bookable) && item?.status_name === "Available" && <ReservationCard {...{ item, type: "book" }} /> }
      </div>
    </>
  );
};

export default Page;

