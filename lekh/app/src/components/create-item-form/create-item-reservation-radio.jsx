import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from "@/components/ui/field";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { Controller } from "react-hook-form";

const CreateItemReservationRadio = ({ form, field, fieldState }) => {
  const reservationType = field.value
    ? "borrow"
    : form.watch("bookable")
      ? "book"
      : "none";

  return (
    <FieldSet>
      <FieldLabel>Reservation Type</FieldLabel>

      <RadioGroup
        value={reservationType}
        onValueChange={(value) => {
          field.onChange(value === "borrow");

          form.setValue(
            "bookable",
            value === "book",
            {
              shouldDirty: true,
              shouldValidate: true,
            }
          );
        }}
        className="flex flex-col gap-3"
      >
        <Field orientation="horizontal">
          <RadioGroupItem
            id="reservation-none"
            value="none"
            aria-invalid={fieldState.invalid}
          />

          <FieldLabel htmlFor="reservation-none">
            Not reservable
          </FieldLabel>
        </Field>

        <Field orientation="horizontal">
          <RadioGroupItem
            id="reservation-borrow"
            value="borrow"
            aria-invalid={fieldState.invalid}
          />

          <FieldLabel htmlFor="reservation-borrow">
            Borrowable — borrow home for a few days.
          </FieldLabel>
        </Field>

        <Field orientation="horizontal">
          <RadioGroupItem
            id="reservation-book"
            value="book"
            aria-invalid={fieldState.invalid}
          />

          <FieldLabel htmlFor="reservation-book">
            Bookable — use on premise for a few hours.
          </FieldLabel>
        </Field>
      </RadioGroup>

      <FieldError errors={[fieldState.error]} />
    </FieldSet>
  );
};

export { CreateItemReservationRadio };

