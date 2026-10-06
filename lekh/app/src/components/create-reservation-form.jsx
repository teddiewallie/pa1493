import { useState } from "react";
import { addDays, setHours, setMinutes } from "date-fns";

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

    if (type === "borrow") {
      if (!dateRange?.from || !dateRange?.to) {
        return;
      }

      const reservation = {
        itemId: item.id,
        startAt: dateRange.from,
        endAt: dateRange.to,
      };

      console.log(reservation);
      return;
    }

    // TODO: type book
  };

  const buttonText = type === "book"
    ? "Book this Unit"
    : "Request to Borrow";

  const slots = [
    {
      value: "08:00-11:00",
      label: "08:00 – 11:00"
    },
    {
      value: "11:00-14:00",
      label: "11:00 – 14:00"
    },
    {
      value: "14:00-17:00",
      label: "14:00 – 17:00"
    },
    {
      value: "17:00-20:00",
      label: "17:00 – 20:00"
    },
  ];

  const bookedSlots = [
    "11:00-14:00",
    "17:00-20:00"
  ];

  const bookedDates = [];

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
        min={1}
        max={7}
        disabled={bookedDates}
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
          const selected = selectedSlot === slot.value;
          const booked = bookedSlots.includes(slot.value);

          return (
            <Field key={slot.value}>
              <RadioGroupItem
                value={slot.value}
                id={slot.value}
                disabled={booked}
                className="hidden"
              />

              <FieldLabel
                htmlFor={slot.value}
                className={`
                  flex min-h-12 items-center justify-center
                  border px-4
                  text-lg font-medium
                  ${
                    booked
                      ? "cursor-not-allowed opacity-40"
                      : "cursor-pointer"
                  }
                  ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }
                `}
              >
                {slot.label}
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

