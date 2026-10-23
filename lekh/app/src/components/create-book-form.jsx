// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { slots } from "@/slots";
import { setHours, setMinutes, addDays, isSameDay } from "date-fns";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const CreateBookForm = ({
  item,
  callback,
  bookings,
  borrowings,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const now = new Date();

  const getSlotTimes = (slot) => {
    const [start, end] = slot.split("-");
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    const startAt = setMinutes(
      setHours(new Date(), startHours),
      startMinutes
    );

    let endAt = setMinutes(
      setHours(new Date(), endHours),
      endMinutes
    );

    if (endAt <= startAt) {
      endAt = addDays(endAt, 1);
    }

    return { startAt, endAt };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSlot) return;

    const { startAt, endAt } = getSlotTimes(selectedSlot);

    if (
      startAt <= new Date() ||
      borrowings.some((date) => isSameDay(date, startAt))
    ) {
      setSelectedSlot(null);
      return;
    }

    const reservation = {
      itemId: item.id,
      startAt,
      endAt,
      reservationType: "book",
    };

    await callback(reservation);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-row">
      <div className="min-w-0 flex-1">
        <div className="overflow-hidden border border-r-0">
          <RadioGroup
            value={selectedSlot}
            onValueChange={setSelectedSlot}
            className="max-h-128 gap-0 overflow-scroll"
          >
            {slots.map((slot) => {
              const selected = selectedSlot === slot;
              const booked = bookings.includes(slot);
              const { startAt } = getSlotTimes(slot);
              const borrowed = borrowings.some((date) =>
                isSameDay(date, startAt)
              );
              const expired = startAt <= now;
              const disabled = booked || borrowed || expired;

              return (
                <Field key={slot}>
                  <RadioGroupItem
                    value={slot}
                    id={slot}
                    disabled={disabled}
                    className="hidden"
                  />

                  <FieldLabel
                    htmlFor={slot}
                    className={`
                      flex min-h-12 items-center justify-center
                      border px-4
                      text-lg font-medium
                      ${
                        disabled
                          ? "pointer-events-none opacity-40 line-through"
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
        disabled={!selectedSlot}
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

