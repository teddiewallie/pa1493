import { useState } from "react";
import { addDays, setHours, setMinutes } from "date-fns";
import { slots } from "@/slots";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const CreateReservationForm = ({ item, type }) => {
  const [ selectedSlot, setSelectedSlot ] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    let reservation;

    if (type === "borrow") {
      if (!dateRange?.from || !dateRange?.to) {
        return;
      }

      reservation = {
        itemId: item.id,
        startAt: dateRange.from,
        endAt: dateRange.to,
      };
    }

    if (type === "book") {
      if (!selectedSlot) {
        return;
      }

      const [start, end] = selectedSlot.split("-");
      const [startHours, startMinutes] = start.split(":").map(Number);
      const [endHours, endMinutes] = end.split(":").map(Number);

      const now = new Date();

      const startAt = setMinutes(
        setHours(now, startHours),
        startMinutes
      );

      const endAt = setMinutes(
        setHours(now, endHours),
        endMinutes
      );

      reservation = {
        itemId: item.id,
        startAt,
        endAt,
      };
    }
  };

  const buttonText = type === "book"
    ? "Book this Unit"
    : "Request to Borrow";

  const mockBookedSlots = [
    "11:00-14:00",
    "17:00-20:00"
  ];

  const bookedDates = [addDays(new Date(), 3)];

  const isSameOrBetween = (date, from, to) => {
    const time = new Date(date).setHours(0, 0, 0, 0);
    const start = new Date(from).setHours(0, 0, 0, 0);
    const end = new Date(to).setHours(0, 0, 0, 0);

    return time >= start && time <= end;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-row"
    >
      <div className="min-w-0 flex-1">
      { type === "borrow" && <Calendar
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
        max={7}
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
      /> }

      { type === "book" && <div className="overflow-hidden border border-r-0">
        <RadioGroup
          value={selectedSlot}
          onValueChange={setSelectedSlot}
          className="gap-0 max-h-128 overflow-scroll"
        >
        {slots.map((slot) => {
          const selected = selectedSlot === slot;
          const booked = mockBookedSlots.includes(slot);

          return (
            <Field key={slot}>
              <RadioGroupItem
                value={slot}
                id={slot}
                disabled={booked}
                className="hidden"
              />

              <FieldLabel
                htmlFor={slot}
                className={`
                  flex min-h-12 items-center justify-center
                  border px-4
                  text-lg font-medium
                  ${
                    booked
                      ? "opacity-40"
                      : ""
                  }
                  ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }
                `}
              >
                {slot.replace("-", " - ")}
              </FieldLabel>
            </Field>
          );
        })}
        </RadioGroup>
      </div> }
      </div>

      <Button
        type="submit"
        className="w-12 h-auto shrink-0 rounded-none border-l-0"
      >
        <span className="rotate-90 whitespace-nowrap">
          {buttonText}
        </span>
      </Button>
    </form>
  );
};

export { CreateReservationForm };

