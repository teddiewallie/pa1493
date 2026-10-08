import { CreateBookForm } from "@/components/create-book-form";
import { CreateBorrowForm } from "@/components/create-borrow-form";

const CreateReservation = ({ item, type }) => {
  return (
    <>
      { type === "book" && <CreateBookForm {...{ item }} /> }
      { type === "borrow" && <CreateBorrowForm {...{ item }} /> }
    </>
  );
};

export { CreateReservation };

