
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { CreateReservation } from "./create-reservation";
import { ReservationsContext } from "@/context/reservations-context";
import { addReservation } from "@/service/save-reservation";
import { toast } from "@/components/ui/toast";

vi.mock("@/service/save-reservation", () => ({
  addReservation: vi.fn(),
}));

vi.mock("@/components/ui/toast", () => ({
  toast: { add: vi.fn() },
}));

vi.mock("@/components/create-book-form", () => ({
  CreateBookForm: ({ item, callback, bookings }) => (
    <div>
      <div data-testid="reservation-form">book</div>
      <div data-testid="item-id">{String(item.id)}</div>
      <div data-testid="bookings">{bookings.join(",")}</div>
      <button
        type="button"
        onClick={() =>
          callback({
            itemId: -1,
            startAt: new Date("2026-10-18T10:00:00"),
            endAt: new Date("2026-10-18T11:00:00"),
          })
        }
      >
        Submit booking
      </button>
    </div>
  ),
}));

vi.mock("@/components/create-borrow-form", () => ({
  CreateBorrowForm: ({ item, callback, borrowings }) => (
    <div>
      <div data-testid="reservation-form">borrow</div>
      <div data-testid="item-id">{String(item.id)}</div>
      <div data-testid="borrowings">
        {borrowings.map((date) => date.toDateString()).join("|")}
      </div>
      <button
        type="button"
        onClick={() =>
          callback({
            itemId: -1,
            startAt: new Date("2026-10-19T00:00:00"),
            endAt: new Date("2026-10-20T00:00:00"),
          })
        }
      >
        Submit borrow request
      </button>
    </div>
  ),
}));

const item = {
  id: 42,
  bookable: true,
  borrowable: false,
};

const makeReservation = (overrides = {}) => ({
  item_id: 42,
  start_at: new Date("2026-10-18T10:00:00"),
  end_at: new Date("2026-10-18T11:00:00"),
  returned_at: null,
  ...overrides,
});

const renderComponent = ({
  currentItem = item,
  reservations = [],
  refreshReservations = vi.fn(),
} = {}) => {
  const result = render(
    <ReservationsContext.Provider
      value={{ reservations, refreshReservations }}
    >
      <CreateReservation item={currentItem} />
    </ReservationsContext.Provider>
  );

  return { ...result, refreshReservations };
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-18T08:30:00"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CreateReservation", () => {
  it("renders the booking form for a bookable item", () => {
    renderComponent();

    expect(screen.getByTestId("reservation-form")).toHaveTextContent("book");
    expect(screen.getByTestId("item-id")).toHaveTextContent("42");
  });

  it("renders the borrowing form for a borrowable item", () => {
    renderComponent({
      currentItem: { id: 42, bookable: false, borrowable: true },
    });

    expect(screen.getByTestId("reservation-form")).toHaveTextContent("borrow");
  });

  it("renders no reservation form when the item is neither bookable nor borrowable", () => {
    renderComponent({
      currentItem: { id: 42, bookable: false, borrowable: false },
    });

    expect(screen.queryByTestId("reservation-form")).not.toBeInTheDocument();
  });

  it("passes only active same-day booking slots for the current item", () => {
    const reservations = [
      makeReservation(),
      makeReservation({
        start_at: new Date("2026-10-18T12:00:00"),
        end_at: new Date("2026-10-18T13:00:00"),
        returned_at: new Date("2026-10-18T13:30:00"),
      }),
      makeReservation({
        item_id: 99,
        start_at: new Date("2026-10-18T14:00:00"),
        end_at: new Date("2026-10-18T15:00:00"),
      }),
      makeReservation({
        start_at: new Date("2026-10-19T10:00:00"),
        end_at: new Date("2026-10-19T11:00:00"),
      }),
      makeReservation({
        start_at: new Date("2026-10-18T00:00:00"),
        end_at: new Date("2026-10-18T00:00:00"),
      }),
    ];

    renderComponent({ reservations });

    expect(screen.getByTestId("bookings")).toHaveTextContent(
      "10:00-11:00"
    );
    expect(screen.getByTestId("bookings")).not.toHaveTextContent(
      "12:00-13:00"
    );
    expect(screen.getByTestId("bookings")).not.toHaveTextContent(
      "14:00-15:00"
    );
  });

  it("passes active borrowing dates for the current item", () => {
    const reservations = [
      makeReservation({
        start_at: new Date("2026-10-19T00:00:00"),
        end_at: new Date("2026-10-21T00:00:00"),
      }),
      makeReservation({
        item_id: 99,
        start_at: new Date("2026-10-22T00:00:00"),
        end_at: new Date("2026-10-23T00:00:00"),
      }),
      makeReservation({
        start_at: new Date("2026-10-24T00:00:00"),
        end_at: new Date("2026-10-25T00:00:00"),
        returned_at: new Date("2026-10-25T12:00:00"),
      }),
    ];

    renderComponent({
      currentItem: { id: 42, bookable: false, borrowable: true },
      reservations,
    });

    expect(screen.getByTestId("borrowings")).toHaveTextContent(
      "Mon Oct 19 2026|Tue Oct 20 2026|Wed Oct 21 2026"
    );
    expect(screen.getByTestId("borrowings")).not.toHaveTextContent("Oct 22");
    expect(screen.getByTestId("borrowings")).not.toHaveTextContent("Oct 24");
  });

  it("saves a successful booking, shows a toast, and refreshes reservations", async () => {
    addReservation.mockResolvedValue(true);
    const refreshReservations = vi.fn();

    renderComponent({ refreshReservations });

    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() => {
      expect(addReservation).toHaveBeenCalledWith({
        itemId: 42,
        isPending: false,
        startAt: new Date("2026-10-18T10:00:00"),
        endAt: new Date("2026-10-18T11:00:00"),
      });
      expect(refreshReservations).toHaveBeenCalledTimes(1);
      expect(toast.add).toHaveBeenCalledWith({
        title: "Unit booked.",
      });
    });
  });

  it("shows an error toast without refreshing when booking fails", async () => {
    addReservation.mockResolvedValue(false);
    const refreshReservations = vi.fn();

    renderComponent({ refreshReservations });

    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith({
        title: "Unit could not be booked.",
      });
    });

    expect(refreshReservations).not.toHaveBeenCalled();
  });

  it("sends borrowing requests as pending and refreshes on success", async () => {
    addReservation.mockResolvedValue(true);
    const refreshReservations = vi.fn();

    renderComponent({
      currentItem: { id: 42, bookable: false, borrowable: true },
      refreshReservations,
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Submit borrow request" })
    );

    await waitFor(() => {
      expect(addReservation).toHaveBeenCalledWith({
        itemId: 42,
        isPending: true,
        startAt: new Date("2026-10-19T00:00:00"),
        endAt: new Date("2026-10-20T00:00:00"),
      });
      expect(toast.add).toHaveBeenCalledWith({
        title: "Borrow request sent.",
      });
      expect(refreshReservations).toHaveBeenCalledTimes(1);
    });
  });

  it("shows an error toast when a borrowing request fails", async () => {
    addReservation.mockResolvedValue(false);

    renderComponent({
      currentItem: { id: 42, bookable: false, borrowable: true },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Submit borrow request" })
    );

    await waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith({
        title: "Couldn't send borrow request.",
      });
    });
  });

  it("prioritizes booking when an item is both bookable and borrowable", async () => {
    addReservation.mockResolvedValue(true);

    renderComponent({
      currentItem: { id: 42, bookable: true, borrowable: true },
    });

    expect(screen.getByTestId("reservation-form")).toHaveTextContent("book");

    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() => {
      expect(addReservation).toHaveBeenCalledWith(
        expect.objectContaining({
          itemId: 42,
          isPending: true,
        })
      );
      expect(toast.add).toHaveBeenCalledWith({
        title: "Borrow request sent.",
      });
    });
  });
});

