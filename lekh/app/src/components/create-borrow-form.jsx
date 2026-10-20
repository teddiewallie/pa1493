"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  addDays,
  eachDayOfInterval,
  isSameDay,
  startOfDay,
} from "date-fns";

const isDateUnavailable = (date, bookings, borrowings) => {
  const selectedDate = startOfDay(date);
  const today = startOfDay(new Date());

  return (
    selectedDate < today ||
    bookings.some((bookedDate) => isSameDay(bookedDate, selectedDate)) ||
    borrowings.some((borrowedDate) =>
      isSameDay(borrowedDate, selectedDate)
    )
  );
};

const getFirstAvailableDate = (bookings, borrowings) => {
  let date = startOfDay(new Date());

  // Find a free start and end date for the initial range.
  while (
    isDateUnavailable(date, bookings, borrowings) ||
    isDateUnavailable(addDays(date, 1), bookings, borrowings)
  ) {
    date = addDays(date, 1);
  }

  return date;
};

const CreateBorrowForm = ({
  item,
  callback,
  bookings = [],
  borrowings = [],
}) => {
  const firstAvailable = getFirstAvailableDate(bookings, borrowings);

  const [dateRange, setDateRange] = useState({
    from: firstAvailable,
    to: addDays(firstAvailable, 1),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dateRange?.from || !dateRange?.to) {
      return;
    }

    const startAt = startOfDay(dateRange.from);
    const endAt = startOfDay(dateRange.to);

    // Revalidate the complete range before submitting.
    const rangeDates = eachDayOfInterval({
      start: startAt,
      end: endAt,
    });

    if (
      rangeDates.some((date) =>
        isDateUnavailable(date, bookings, borrowings)
      )
    ) {
      return;
    }

    const reservation = {
      itemId: item.id,
      startAt,
      endAt,
      reservationType: "borrow",
    };

    await callback(reservation);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-row">
      <div className="min-w-0 flex-1">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          numberOfMonths={1}
          className="!w-full bg-transparent"
          classNames={{
            today: "font-bold ring-1 ring-muted-foreground/50",
          }}
          min={1}
          max={6}
          disabled={(date) =>
            isDateUnavailable(date, bookings, borrowings)
          }
          onSelect={(range) => {
            if (!range?.from || !range?.to) {
              setDateRange(range);
              return;
            }

            const rangeDates = eachDayOfInterval({
              start: startOfDay(range.from),
              end: startOfDay(range.to),
            });

            const containsUnavailableDate = rangeDates.some((date) =>
              isDateUnavailable(date, bookings, borrowings)
            );

            if (!containsUnavailableDate) {
              setDateRange(range);
              return;
            }

            // Keep the newly clicked date as the start of a new range.
            const clickedDate =
              dateRange?.from &&
              isSameDay(dateRange.from, range.from)
                ? range.to
                : range.from;

            setDateRange({
              from: clickedDate,
              to: clickedDate,
            });
          }}
          modifiers={{
            booked: [...bookings, ...borrowings],
          }}
          modifiersClassNames={{
            booked: "[&>button]:line-through opacity-100",
          }}
        />
      </div>

      <Button
        type="submit"
        className="w-12 h-auto shrink-0 rounded-none border-l-0"
      >
        <span className="rotate-90 whitespace-nowrap">
          Request to Borrow
        </span>
      </Button>
    </form>
  );
};

export { CreateBorrowForm };
