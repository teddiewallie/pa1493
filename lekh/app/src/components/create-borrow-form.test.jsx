
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateBorrowForm } from "@/components/create-borrow-form";

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({
    selected,
    onSelect,
    disabled,
    modifiers,
  }) => (
    <div data-testid="calendar">
      <div data-testid="selected-from">
        {selected?.from?.toISOString() ?? "none"}
      </div>
      <div data-testid="selected-to">
        {selected?.to?.toISOString() ?? "none"}
      </div>
      <div data-testid="modifiers">
        {JSON.stringify(modifiers)}
      </div>
      <button
        type="button"
        onClick={() =>
          onSelect({
            from: new Date(2026, 9, 21),
            to: new Date(2026, 9, 22),
          })
        }
      >
        Select available range
      </button>
      <button
        type="button"
        onClick={() =>
          onSelect({
            from: new Date(2026, 9, 21),
            to: new Date(2026, 9, 23),
          })
        }
      >
        Select range containing unavailable date
      </button>
      <button
        type="button"
        onClick={() =>
          onSelect({
            from: new Date(2026, 9, 21),
          })
        }
      >
        Select start only
      </button>
      <button
        type="button"
        onClick={() =>
          onSelect({
            from: new Date(2026, 9, 21),
            to: new Date(2026, 9, 22),
          })
        }
        disabled={disabled(new Date(2026, 9, 21))}
      >
        Select date if available
      </button>
    </div>
  ),
}));

const createProps = (overrides = {}) => ({
  item: { id: 42 },
  callback: vi.fn().mockResolvedValue(undefined),
  bookings: [],
  borrowings: [],
  ...overrides,
});

describe("CreateBorrowForm", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 20, 10, 30));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the calendar and submit button", () => {
    render(<CreateBorrowForm {...createProps()} />);

    expect(screen.getByTestId("calendar")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /request to borrow/i })
    ).toBeInTheDocument();
  });

  it("initializes a range using the first two available dates", () => {
    render(<CreateBorrowForm {...createProps()} />);

    expect(screen.getByTestId("selected-from").textContent).toBe(
      new Date(2026, 9, 20).toISOString()
    );
    expect(screen.getByTestId("selected-to").textContent).toBe(
      new Date(2026, 9, 21).toISOString()
    );
  });

  it("skips dates occupied by bookings and borrowings", () => {
    render(
      <CreateBorrowForm
        {...createProps({
          bookings: [new Date(2026, 9, 20)],
          borrowings: [new Date(2026, 9, 21)],
        })}
      />
    );

    expect(screen.getByTestId("selected-from").textContent).toBe(
      new Date(2026, 9, 22).toISOString()
    );
    expect(screen.getByTestId("selected-to").textContent).toBe(
      new Date(2026, 9, 23).toISOString()
    );
  });

  it("submits a valid borrow request", async () => {
    const callback = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<CreateBorrowForm {...createProps({ callback })} />);

    await user.click(
      screen.getByRole("button", { name: "Select available range" })
    );
    await user.click(
      screen.getByRole("button", { name: /request to borrow/i })
    );

    expect(callback).toHaveBeenCalledTimes(1);

    const reservation = callback.mock.calls[0][0];

    expect(reservation.itemId).toBe(42);
    expect(reservation.reservationType).toBe("borrow");
    expect(reservation.startAt).toEqual(new Date(2026, 9, 21));
    expect(reservation.endAt).toEqual(new Date(2026, 9, 22));
  });

  it("does not submit if the selected range contains an unavailable date", async () => {
    const callback = vi.fn();
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    const props = createProps({ callback, borrowings: [] });

    const { rerender } = render(
      <CreateBorrowForm {...props} />
    );

    // Select October 21–22 while both dates are available.
    await user.click(
      screen.getByRole("button", {
        name: "Select available range",
      })
    );

    // October 22 becomes unavailable after the range was selected.
    rerender(
      <CreateBorrowForm
        {...props}
        borrowings={[new Date(2026, 9, 22)]}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /request to borrow/i,
      })
    );

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not submit when the range is incomplete", async () => {
    const callback = vi.fn();
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<CreateBorrowForm {...createProps({ callback })} />);

    await user.click(
      screen.getByRole("button", { name: "Select start only" })
    );
    await user.click(
      screen.getByRole("button", { name: /request to borrow/i })
    );

    expect(callback).not.toHaveBeenCalled();
  });

  it("allows selecting a new start date when the chosen range is invalid", async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(
      <CreateBorrowForm
        {...createProps({
          borrowings: [new Date(2026, 9, 22)],
        })}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Select range containing unavailable date",
      })
    );

    expect(screen.getByTestId("selected-from").textContent).toBe(
      new Date(2026, 9, 21).toISOString()
    );
    expect(screen.getByTestId("selected-to").textContent).toBe(
      new Date(2026, 9, 21).toISOString()
    );
  });

  it("marks booked and borrowed dates in the calendar modifiers", () => {
    render(
      <CreateBorrowForm
        {...createProps({
          bookings: [new Date(2026, 9, 21)],
          borrowings: [new Date(2026, 9, 22)],
        })}
      />
    );

    const modifiers = JSON.parse(
      screen.getByTestId("modifiers").textContent
    );

    expect(modifiers.booked).toHaveLength(2);
  });

  it("does not select a date in the past as the initial start date", () => {
    render(
      <CreateBorrowForm
        {...createProps({
          bookings: [new Date(2026, 9, 20)],
          borrowings: [new Date(2026, 9, 21)],
        })}
      />
    );

    expect(new Date(screen.getByTestId("selected-from").textContent))
      .toEqual(new Date(2026, 9, 22));
  });
});

