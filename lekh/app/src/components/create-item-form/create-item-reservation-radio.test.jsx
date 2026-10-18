import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { CreateItemReservationRadio } from "./create-item-reservation-radio";

vi.mock("@/components/ui/field", () => ({
  Field: ({ children }) => <div>{children}</div>,
  FieldGroup: ({ children }) => <div>{children}</div>,
  FieldLabel: ({ children, htmlFor }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  FieldSet: ({ children }) => <fieldset>{children}</fieldset>,
  FieldError: ({ errors }) => (
    <>
      {errors?.filter(Boolean).map((error, index) => (
        <p key={index}>{error.message}</p>
      ))}
    </>
  ),
}));

vi.mock("@/components/ui/radio-group", () => ({
  RadioGroup: ({ onValueChange }) => (
    <div>
      <button
        type="button"
        onClick={() => onValueChange("none")}
      >
        Select none
      </button>

      <button
        type="button"
        onClick={() => onValueChange("borrow")}
      >
        Select borrow
      </button>

      <button
        type="button"
        onClick={() => onValueChange("book")}
      >
        Select book
      </button>
    </div>
  ),
  RadioGroupItem: () => null,
}));

const renderComponent = ({
  borrowable = false,
  bookable = false,
  invalid = false,
} = {}) => {
  const form = {
    watch: vi.fn((name) =>
      name === "bookable" ? bookable : undefined
    ),
    setValue: vi.fn(),
  };

  const field = {
    value: borrowable,
    onChange: vi.fn(),
  };

  const fieldState = {
    invalid,
    error: invalid
      ? { message: "Invalid reservation type" }
      : undefined,
  };

  render(
    <CreateItemReservationRadio
      form={form}
      field={field}
      fieldState={fieldState}
    />
  );

  return { form, field };
};

describe("CreateItemReservationRadio", () => {
  it.each([
    ["none", false, false],
    ["borrow", true, false],
    ["book", false, true],
  ])(
    "maps the %s option to the correct form values",
    async (option, expectedBorrowable, expectedBookable) => {
      const user = userEvent.setup();
      const { form, field } = renderComponent();

      await user.click(
        screen.getByRole("button", {
          name: `Select ${option}`,
        })
      );

      expect(field.onChange).toHaveBeenCalledWith(
        expectedBorrowable
      );

      expect(form.setValue).toHaveBeenCalledWith(
        "bookable",
        expectedBookable,
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );
    }
  );

  it("displays the validation error when the field is invalid", () => {
    renderComponent({ invalid: true });

    expect(
      screen.getByText("Invalid reservation type")
    ).toBeInTheDocument();
  });
});

