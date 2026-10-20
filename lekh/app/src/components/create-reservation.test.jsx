import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";

import { CreateReservation } from "./create-reservation";
import { ReservationsContext } from "@/context/reservations-context";
import { addReservation } from "@/service/save-reservation";
import { toast } from "@/components/ui/toast";

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useContext: vi.fn(),
  };
});

vi.mock("@/components/create-book-form", () => ({
  CreateBookForm: vi.fn(({ item, callback, bookings, borrowings }) => (
    <div data-testid="create-book-form">
      <span data-testid="book-item-id">{item.id}</span>
      <span data-testid="bookings">{JSON.stringify(bookings)}</span>
      <span data-testid="book-borrowings">
        {JSON.stringify(borrowings.map((date) => date.toISOString()))}
      </span>
      <button
        onClick={() =>
          callback({
            itemId: item.id,
            reservationType: "book",
          })
        }
      >
        Submit booking
      </button>
    </div>
  )),
}));

vi.mock("@/components/create-borrow-form", () => ({
  CreateBorrowForm: vi.fn(({ item, callback, bookings, borrowings }) => (
    <div data-testid="create-borrow-form">
      <span data-testid="borrow-item-id">{item.id}</span>
      <span data-testid="borrow-bookings">
        {JSON.stringify(bookings.map((date) => date.toISOString()))}
      </span>
      <span data-testid="borrow-borrowings">
        {JSON.stringify(borrowings.map((date) => date.toISOString()))}
      </span>
      <button
        onClick={() =>
          callback({
            itemId: item.id,
            reservationType: "borrow",
          })
        }
      >
        Submit borrow request
      </button>
    </div>
  )),
}));

vi.mock("@/service/save-reservation", () => ({
  addReservation: vi.fn(),
}));

vi.mock("@/components/ui/toast", () => ({
  toast: {
    add: vi.fn(),
  },
}));

describe("CreateReservation", () => {
  const refreshReservations = vi.fn();

  const setReservations = (reservations = []) => {
    useContext.mockReturnValue({
      reservations,
      refreshReservations,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setReservations();
    addReservation.mockResolvedValue(true);
  });

  it("renders the booking form when the item is bookable", () => {
    setReservations([]);

    render(
      <CreateReservation
        item={{ id: 1, bookable: true, borrowable: true }}
      />
    );

    expect(screen.getByTestId("create-book-form")).toBeInTheDocument();
    expect(screen.queryByTestId("create-borrow-form")).not.toBeInTheDocument();
  });

  it("renders the borrowing form when the item is borrowable but not bookable", () => {
    render(
      <CreateReservation
        item={{ id: 2, bookable: false, borrowable: true }}
      />
    );

    expect(screen.getByTestId("create-borrow-form")).toBeInTheDocument();
    expect(screen.queryByTestId("create-book-form")).not.toBeInTheDocument();
  });

  it("renders an empty div when the item is neither bookable nor borrowable", () => {
    const { container } = render(
      <CreateReservation
        item={{ id: 3, bookable: false, borrowable: false }}
      />
    );

    expect(container.querySelector("div")).toBeInTheDocument();
    expect(screen.queryByTestId("create-book-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("create-borrow-form")).not.toBeInTheDocument();
  });

  it("only processes reservations belonging to the current item", () => {
    setReservations([
      {
        item_id: 1,
        start_at: "2026-10-20T10:00:00",
        end_at: "2026-10-20T11:00:00",
        returned_at: null,
      },
      {
        item_id: 2,
        start_at: "2026-10-20T12:00:00",
        end_at: "2026-10-20T13:00:00",
        returned_at: null,
      },
    ]);

    render(
      <CreateReservation
        item={{ id: 1, bookable: true, borrowable: false }}
      />
    );

    expect(screen.getByTestId("bookings")).toHaveTextContent(
      JSON.stringify(["10:00-11:00"])
    );
  });

  it("excludes returned reservations", () => {
    setReservations([
      {
        item_id: 1,
        start_at: "2026-10-20T10:00:00",
        end_at: "2026-10-20T11:00:00",
        returned_at: "2026-10-20T11:00:00",
      },
    ]);

    render(
      <CreateReservation
        item={{ id: 1, bookable: true, borrowable: false }}
      />
    );

    expect(screen.getByTestId("bookings")).toHaveTextContent("[]");
  });

  it("calls addReservation, shows success toast, and refreshes reservations after a successful booking", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    addReservation.mockResolvedValue(true);

    render(
      <CreateReservation
        item={{ id: 1, bookable: true, borrowable: false }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() => {
      expect(addReservation).toHaveBeenCalledWith(
        expect.objectContaining({
          itemId: 1,
          isPending: false,
          reservationType: "book",
        })
      );
      expect(toast.add).toHaveBeenCalledWith({
        title: "Unit booked.",
      });
      expect(refreshReservations).toHaveBeenCalledOnce();
    });
  });

  it("shows an error toast and does not refresh after a failed booking", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    addReservation.mockResolvedValue(false);

    render(
      <CreateReservation
        item={{ id: 1, bookable: true, borrowable: false }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith({
        title: "Unit could not be booked.",
      });
    });

    expect(refreshReservations).not.toHaveBeenCalled();
  });

  it("marks borrow requests as pending when the item is borrowable", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    render(
      <CreateReservation
        item={{ id: 2, bookable: false, borrowable: true }}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Submit borrow request" })
    );

    await waitFor(() => {
      expect(addReservation).toHaveBeenCalledWith(
        expect.objectContaining({
          itemId: 2,
          isPending: true,
          reservationType: "borrow",
        })
      );
      expect(toast.add).toHaveBeenCalledWith({
        title: "Borrow request sent.",
      });
      expect(refreshReservations).toHaveBeenCalledOnce();
    });
  });

  it("shows an error toast when a borrow request fails", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    addReservation.mockResolvedValue(false);

    render(
      <CreateReservation
        item={{ id: 2, bookable: false, borrowable: true }}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Submit borrow request" })
    );

    await waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith({
        title: "Couldn't send borrow request.",
      });
    });

    expect(refreshReservations).not.toHaveBeenCalled();
  });
});
