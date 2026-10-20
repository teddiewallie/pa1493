"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import { use, useContext, useEffect } from "react";
import { UserContext } from "@/context/user-context";
import { ReservationsContext } from "@/context/reservations-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ArticleContext } from "@/context/article-context";
import { ItemCard } from "@/components/item-card";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";
import { ReportItemForm } from "@/components/report-item-form";
import { SimpleCard } from "@/components/simple-card";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/link-button";
import { ArticleList } from "@/components/article-list";
import { ReservationCard } from "@/components/reservation-card";
import { ReservationHistoryCard } from "@/components/reservation-history-card";
import { setReturned } from "@/service/set-returned";
import { toast } from "@/components/ui/toast";

const Page = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();

  const { user } = useContext(UserContext);
  const { items, refreshItems, meta, groups, loading } = useContext(EquipmentContext);
  const { articles, articleTypes } = useContext(ArticleContext);
  const { reservations, refreshReservations } = useContext(ReservationsContext);

  const item = items?.find((thisItem) => thisItem.id == id);
  const group = groups?.find((thisGroup) => thisGroup.id == item?.group_id);

  useEffect(() => {
    if (!loading && !item) {
      router.replace("/types");
    }
  }, [item, router, loading]);

  const itemIssues = item?.known_issues;
  const groupIssues = group?.known_issues;

  const itemArticles = articles.filter(
    (article) => article.item_id == item?.id
  );

  const groupArticles = articles.filter(
    (article) => article.group_id == item?.group_id
  );

  const itemReservations = reservations
    .filter((reservation) => reservation.item_id === item?.id)
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

  const activeReservation = itemReservations.find(
    (reservation) =>
      reservation.returned_at === null &&
      new Date(reservation.start_at) <= new Date()
  );

  const isNotPending = !Boolean(activeReservation?.is_pending);

  return (
    <>
      <div className="container px-10 md:mx-auto mt-4 text-2xl font-bold">
        <div className="flex items-center">
          <Link href={`/units/by-type/${item?.group_id}`}>
            <CircleArrowLeft className="inline mr-2" />
            {group && group.name} /
            {item && ` ${item.name} - ${item.serial}`}
          </Link>
        </div>
      </div>

      <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:mx-auto px-10 mt-2">
        {user.role_id == 1 && (
          <LinkButton href={`/editor/for-unit/${id}`}>
            Add Article
          </LinkButton>
        )}

        <ModalWithToast title="Report Issue" noContainer>
          <ReportItemForm
            item={item}
            onSuccess={() => {
              toast.add({ title: "Successfully reported item." });
              refreshItems();
            }}
            onFail={() => {
              toast.add({ title: "Failed to report item." });
            }}
          />
        </ModalWithToast>

        {user.role_id == 1 && (
          <ModalWithToast title="Edit Unit" noContainer>
            <CreateItemForm
              item={item}
              onSuccess={() => {
                toast.add({ title: "Item successfully edited." });
                refreshItems();
              }}
              onFail={() => {
                toast.add({ title: "Failed to edit item." });
              }}
              statuses={meta?.status}
            />
          </ModalWithToast>
        )}

        {user.role_id == 1 &&
          activeReservation &&
          !activeReservation.is_pending && (
            <Button
              onClick={async () => {
                const result = await setReturned(activeReservation.id);

                if (result) {
                  toast.add({ title: "Item marked as returned." });
                  refreshItems();
                  refreshReservations();
                } else {
                  toast.add({ title: "Failed to mark item as returned." });
                }
              }}
              variant="outline"
            >
              Mark as Returned
            </Button>
          )}
      </div>

      <div className="container px-10 md:mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 my-4">
        <ItemCard item={item} single activeReservation={activeReservation} />

        {itemArticles?.length > 0 && (
          <ArticleList
            articles={itemArticles}
            articleTypes={articleTypes}
            title="Unit Articles"
          />
        )}

        {groupArticles?.length > 0 && (
          <ArticleList
            articles={groupArticles}
            articleTypes={articleTypes}
            title="Type Articles"
          />
        )}

        {itemIssues?.length > 0 && (
          <SimpleCard
            title="Known Unit Issues"
            description="Unit specific issues."
            content={itemIssues}
          />
        )}

        {groupIssues?.length > 0 && (
          <SimpleCard
            title="Known Type Issues"
            description="Type spanning issues."
            content={groupIssues}
          />
        )}

        {Boolean(item?.borrowable) && <ReservationCard item={item} />}

        {Boolean(item?.bookable) && item?.status_name === "Available" && (
          <ReservationCard item={item} />
        )}

        {Boolean(item?.borrowable) && Boolean(itemReservations.length) && (
          <ReservationHistoryCard reservations={itemReservations} />
        )}

        {Boolean(item?.bookable) && Boolean(itemReservations.length) && (
          <ReservationHistoryCard reservations={itemReservations} showTime />
        )}
      </div>
    </>
  );
};

export default Page;

