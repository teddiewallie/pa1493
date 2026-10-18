
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { addDays, startOfDay } from "date-fns";

import { CreateBorrowForm } from "./create-borrow-form";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ selected, disabled, onSelect }) => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const dayAfterTomorrow = addDays(today, 2);
    const threeDaysFromNow = addDays(today, 3);

    return (
      <div>
        <div data-testid="selected-from">
          {selected?.from?.toDateString() ?? "none"}
        </div>
        <div data-testid="selected-to">
          {selected?.to?.toDateString() ?? "none"}
        </div>

        <div data-testid="today-disabled">
          {String(disabled(today))}
        </div>
        <div data-testid="tomorrow-disabled">
          {String(disabled(tomorrow))}
        </div>
        <div data-testid="day-after-tomorrow-disabled">
          {String(disabled(dayAfterTomorrow))}
        </div>

        <button
          type="button"
          onClick={() => onSelect({ from: today, to: tomorrow })}
        >
          Select today through tomorrow
        </button>

        <button
          type="button"
          onClick={() =>
            onSelect({ from: today, to: threeDaysFromNow })
          }
        >
          Select range containing booked date
        </button>

        <button
          type="button"
          onClick={() => onSelect({ from: tomorrow })}
        >
          Select incomplete range
        </button>
      </div>
    );
  },
}));

const item = { id: 42, name: "Arduino" };

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-18T10:30:00"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CreateBorrowForm", () => {
  it("initializes the range with today and tomorrow when neither is booked", () => {
    render(
      <CreateBorrowForm item={item} callback={vi.fn()} borrowings={[]} />
    );

    expect(screen.getByTestId("selected-from")).toHaveTextContent(
      new Date("2026-10-18").toDateString()
    );
    expect(screen.getByTestId("selected-to")).toHaveTextContent(
      new Date("2026-10-19").toDateString()
    );
  });

  it("starts on the first available day when today is booked", () => {
    render(
      <CreateBorrowForm
        item={item}
        callback={vi.fn()}
        borrowings={[new Date("2026-10-18T15:00:00")]}
      />
    );

    expect(screen.getByTestId("selected-from")).toHaveTextContent(
      new Date("2026-10-19").toDateString()
    );
    expect(screen.getByTestId("selected-to")).toHaveTextContent(
      new Date("2026-10-20").toDateString()
    );
  });

  it("disables past dates and booked dates", () => {
    render(
      <CreateBorrowForm
        item={item}
        callback={vi.fn()}
        borrowings={[new Date("2026-10-20T12:00:00")]}
      />
    );

    expect(screen.getByTestId("today-disabled")).toHaveTextContent("false");
    expect(screen.getByTestId("tomorrow-disabled")).toHaveTextContent("false");
    expect(
      screen.getByTestId("day-after-tomorrow-disabled")
    ).toHaveTextContent("true");
  });

  it("submits the selected date range with the item ID and start-of-day dates", () => {
    const callback = vi.fn();

    render(
      <CreateBorrowForm item={item} callback={callback} borrowings={[]} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Select today through tomorrow" })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /request to borrow/i })
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      itemId: 42,
      startAt: new Date("2026-10-18T00:00:00"),
      endAt: new Date("2026-10-19T00:00:00"),
    });
  });

  it("rejects a range containing a booked date and selects the clicked date instead", () => {
    const callback = vi.fn();
    const bookedDate = new Date("2026-10-20T12:00:00");

    render(
      <CreateBorrowForm
        item={item}
        callback={callback}
        borrowings={[bookedDate]}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Select range containing booked date",
      })
    );

    // The initial range starts today, so the mock selection's end date
    // represents the date clicked according to the component's logic.
    expect(screen.getByTestId("selected-from")).toHaveTextContent(
      new Date("2026-10-21").toDateString()
    );
    expect(screen.getByTestId("selected-to")).toHaveTextContent(
      new Date("2026-10-21").toDateString()
    );

    fireEvent.click(
      screen.getByRole("button", { name: /request to borrow/i })
    );

    expect(callback).toHaveBeenCalledWith({
      itemId: 42,
      startAt: new Date("2026-10-21T00:00:00"),
      endAt: new Date("2026-10-21T00:00:00"),
    });
  });

  it("does not submit when the selected range is incomplete", () => {
    const callback = vi.fn();

    render(
      <CreateBorrowForm item={item} callback={callback} borrowings={[]} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Select incomplete range" })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /request to borrow/i })
    );

    expect(callback).not.toHaveBeenCalled();
  });
});

