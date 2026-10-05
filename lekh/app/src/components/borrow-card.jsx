import { useState } from "react";
import { addDays } from "date-fns";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const BorrowCard = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  });

  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 0, 12 + i)
  );

  return (
    <Card className="flex flex-row p-0 overflow-hidden print:hidden">
      <Calendar
        {...{
          mode: "range",
          defaultMonth: dateRange?.from,
          selected: dateRange,
          onSelect: setDateRange,
          numberOfMonths: 1,
          className: "!w-full bg-transparent",
          min: 1,
          max: 7,
          disabled: bookedDates,
          modifiers: {
            booked: bookedDates,
          },
          modifiersClassNames: {
            booked: "[&>button]:line-through opacity-100",
          },
        }}
      />

      <Button
        className="w-12 h-auto shrink-0 rounded-none"
      >
        <span className="rotate-90 whitespace-nowrap">
          Request to Borrow
        </span>
      </Button>
    </Card>
  );
};

export { BorrowCard };
