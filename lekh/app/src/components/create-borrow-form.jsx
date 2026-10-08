import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addDays, setHours } from "date-fns";



const CreateBorrowForm = ({ item }) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const bookedDates = [addDays(new Date(), 3)];

  const isSameOrBetween = (date, from, to) => {
    const time = new Date(date).setHours(0, 0, 0, 0);
    const start = new Date(from).setHours(0, 0, 0, 0);
    const end = new Date(to).setHours(0, 0, 0, 0);

    return time >= start && time <= end;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dateRange?.from || !dateRange?.to) {
      return;
    }

    const reservation = {
      itemId: item.id,
      startAt: dateRange.from,
      endAt: dateRange.to,
    };
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-row"
    >
      <div className="min-w-0 flex-1">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={1}
          className="!w-full bg-transparent"
          classNames={{
            today: "font-bold ring-1 ring-muted-foreground/50",
          }}
          min={1}
          max={6}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return (date < today ||
            bookedDates.some(
              (bookedDate) =>
                date.toDateString() === bookedDate.toDateString()
            ))
          }}
          onSelect={(range) => {
            if (!range?.from || !range?.to) {
              setDateRange(range);
              return;
            }

            const from = new Date(range.from).setHours(0, 0, 0, 0);
            const to = new Date(range.to).setHours(0, 0, 0, 0);

            const containsBookedDate = bookedDates.some((bookedDate) => {
              const date = new Date(bookedDate).setHours(0, 0, 0, 0);

              return date > Math.min(from, to) && date < Math.max(from, to);
            });

            if (!containsBookedDate) {
              setDateRange(range);
              return;
            }

            // Determine which date the user actually clicked.
            const previous = dateRange?.from
              ? new Date(dateRange.from).setHours(0, 0, 0, 0)
              : null;

            const clickedDate = previous === from
              ? range.to
              : range.from;

            setDateRange({
              from: clickedDate,
              to: clickedDate,
            });
          }}       
          modifiers={{
            booked: bookedDates,
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

