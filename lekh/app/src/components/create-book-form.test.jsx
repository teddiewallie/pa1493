
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { CreateBookForm } from "./create-book-form";

vi.mock("@/slots", () => ({
  slots: [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
  ],
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/field", () => ({
  Field: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldLabel: ({ children, ...props }) => (
    <label {...props}>{children}</label>
  ),
  FieldSet: ({ children, ...props }) => <fieldset {...props}>{children}</fieldset>,
}));

vi.mock("@/components/ui/radio-group", async () => {
  const React = await import("react");
  const RadioContext = React.createContext(null);

  return {
    RadioGroup: ({ value, onValueChange, children, ...props }) => (
      <RadioContext.Provider value={{ value, onValueChange }}>
        <div role="radiogroup" {...props}>
          {children}
        </div>
      </RadioContext.Provider>
    ),
    RadioGroupItem: ({ value, disabled, ...props }) => {
      const context = React.useContext(RadioContext);

      return (
        <input
          {...props}
          type="radio"
          value={value}
          disabled={disabled}
          checked={context.value === value}
          onChange={() => {
            if (!disabled) context.onValueChange(value);
          }}
        />
      );
    },
  };
});

const item = { id: 42, name: "Arduino" };

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-18T08:30:45"));
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("CreateBookForm", () => {
  it("renders all available time slots", () => {
    render(<CreateBookForm item={item} callback={vi.fn()} bookings={[]} />);

    expect(screen.getByLabelText("09:00 - 10:00")).toBeInTheDocument();
    expect(screen.getByLabelText("10:00 - 11:00")).toBeInTheDocument();
    expect(screen.getByLabelText("11:00 - 12:00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /book this unit/i })
    ).toBeInTheDocument();
  });

  it("disables booked slots", () => {
    render(
      <CreateBookForm
        item={item}
        callback={vi.fn()}
        bookings={["10:00-11:00"]}
      />
    );

    expect(screen.getByLabelText("09:00 - 10:00")).toBeEnabled();
    expect(screen.getByLabelText("10:00 - 11:00")).toBeDisabled();
    expect(screen.getByLabelText("11:00 - 12:00")).toBeEnabled();
  });

  it("submits the selected slot with the item ID and correct dates", () => {
    const callback = vi.fn();

    render(
      <CreateBookForm item={item} callback={callback} bookings={[]} />
    );

    fireEvent.click(screen.getByLabelText("10:00 - 11:00"));
    fireEvent.click(screen.getByRole("button", { name: /book this unit/i }));

    expect(callback).toHaveBeenCalledTimes(1);

    const reservation = callback.mock.calls[0][0];

    expect(reservation.itemId).toBe(42);
    expect(reservation.startAt).toEqual(new Date("2026-10-18T10:00:00"));
    expect(reservation.endAt).toEqual(new Date("2026-10-18T11:00:00"));
  });

  it("does not submit when no slot is selected", () => {
    const callback = vi.fn();

    render(
      <CreateBookForm item={item} callback={callback} bookings={[]} />
    );

    fireEvent.click(screen.getByRole("button", { name: /book this unit/i }));

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not submit a booked slot", () => {
    const callback = vi.fn();

    render(
      <CreateBookForm
        item={item}
        callback={callback}
        bookings={["10:00-11:00"]}
      />
    );

    fireEvent.click(screen.getByLabelText("10:00 - 11:00"));
    fireEvent.click(screen.getByRole("button", { name: /book this unit/i }));

    expect(callback).not.toHaveBeenCalled();
  });
});

