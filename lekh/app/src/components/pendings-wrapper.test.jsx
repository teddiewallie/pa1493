import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PendingsWrapper } from "./pendings-wrapper";
import { EquipmentContext } from "@/context/equipment-context";
import { ReservationsContext } from "@/context/reservations-context";
import { UsersContext } from "@/context/users-context";

vi.mock("@/components/pending-card", () => ({
  PendingCard: ({ pending, item, user, refresh }) => (
    <div data-testid={`pending-card-${pending.id}`}>
      <span>{pending.id}</span>
      <span>{item?.name ?? "Missing item"}</span>
      <span>{user?.name ?? "Missing user"}</span>
      <button onClick={refresh}>Refresh reservations</button>
    </div>
  ),
}));

const items = [
  { id: 1, name: "Oscilloscope" },
  { id: 2, name: "Arduino" },
];

const users = [
  { id: 10, name: "Alex" },
  { id: 20, name: "Sam" },
];

const reservations = [
  {
    id: 100,
    item_id: 1,
    user_id: 10,
    is_pending: true,
  },
  {
    id: 101,
    item_id: 2,
    user_id: 20,
    is_pending: false,
  },
  {
    id: 102,
    item_id: 2,
    user_id: 10,
    is_pending: true,
  },
];

const renderWrapper = ({
  equipment = items,
  reservationList = reservations,
  userList = users,
  refreshReservations = vi.fn(),
} = {}) => {
  return {
    refreshReservations,
    ...render(
      <EquipmentContext.Provider value={{ items: equipment }}>
        <ReservationsContext.Provider
          value={{ reservations: reservationList, refreshReservations }}
        >
          <UsersContext.Provider value={{ users: userList }}>
            <PendingsWrapper />
          </UsersContext.Provider>
        </ReservationsContext.Provider>
      </EquipmentContext.Provider>
    ),
  };
};

describe("PendingsWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the pending borrow requests heading", () => {
    renderWrapper();

    expect(
      screen.getByText("Pending Borrow Requests")
    ).toBeInTheDocument();
  });

  it("renders only reservations marked as pending", () => {
    renderWrapper();

    expect(screen.getByTestId("pending-card-100")).toBeInTheDocument();
    expect(screen.getByTestId("pending-card-102")).toBeInTheDocument();
    expect(screen.queryByTestId("pending-card-101")).not.toBeInTheDocument();
  });

  it("matches each pending reservation with its item and user", () => {
    renderWrapper();

    const firstCard = screen.getByTestId("pending-card-100");
    expect(firstCard).toHaveTextContent("Oscilloscope");
    expect(firstCard).toHaveTextContent("Alex");

    const secondCard = screen.getByTestId("pending-card-102");
    expect(secondCard).toHaveTextContent("Arduino");
    expect(secondCard).toHaveTextContent("Alex");
  });

  it("passes the refresh callback to each pending card", () => {
    const refreshReservations = vi.fn();

    renderWrapper({ refreshReservations });

    const refreshButtons = screen.getAllByRole("button", {
      name: "Refresh reservations",
    });

    expect(refreshButtons).toHaveLength(2);

    refreshButtons[0].click();

    expect(refreshReservations).toHaveBeenCalledTimes(1);
  });

  it("renders nothing extra when there are no pending reservations", () => {
    renderWrapper({
      reservationList: reservations.map((reservation) => ({
        ...reservation,
        is_pending: false,
      })),
    });

    expect(
      screen.getByText("Pending Borrow Requests")
    ).toBeInTheDocument();

    expect(screen.queryByTestId(/^pending-card-/)).not.toBeInTheDocument();
  });

  it("renders fallback values when a referenced item or user is missing", () => {
    renderWrapper({
      equipment: [],
      userList: [],
    });

    expect(screen.getByTestId("pending-card-100"))
      .toHaveTextContent("Missing item");
    expect(screen.getByTestId("pending-card-100"))
      .toHaveTextContent("Missing user");
  });
});

