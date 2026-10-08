import { useState } from "react";
import { Button } from "@/components/ui/button";
import { slots } from "@/slots";
import { setHours, setMinutes, startOfMinute } from "date-fns";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet
} from "@/components/ui/field";

import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

const CreateBookForm = ({ item, callback, bookings }) => {
  const [ selectedSlot, setSelectedSlot ] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedSlot) {
      return;
    }

    const [start, end] = selectedSlot.split("-");
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    const now = new Date();

    const startAt = startOfMinute(setMinutes(
      setHours(now, startHours),
      startMinutes
    ));

    console.log(startAt);

    const endAt = startOfMinute(setMinutes(
      setHours(now, endHours),
      endMinutes
    ));

    const reservation = {
      itemId: item.id,
      startAt,
      endAt
    };

    callback(reservation);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-row"
    >
      <div className="min-w-0 flex-1">
        <div className="overflow-hidden border border-r-0">
          <RadioGroup
            value={selectedSlot}
            onValueChange={setSelectedSlot}
            className="gap-0 max-h-128 overflow-scroll"
          >
          {slots.map((slot) => {
            const selected = selectedSlot === slot;
            const booked = bookings.includes(slot);

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
                        ? "opacity-40 line-through"
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
        </div>
      </div>

      <Button
        type="submit"
        className="w-12 h-auto shrink-0 rounded-none border-l-0"
      >
        <span className="rotate-90 whitespace-nowrap">
          Book this Unit
        </span>
      </Button>
    </form>
  );
};

export { CreateBookForm };

