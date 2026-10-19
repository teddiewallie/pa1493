import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReservationHistoryCard } from "./reservation-history-card";

vi.mock("@/components/simple-card", () => ({
  SimpleCard: ({ title, description, maxHeight, content }) => (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <div data-testid="max-height">{maxHeight}</div>
      <div>{content}</div>
    </section>
  ),
}));

const reservations = [
  {
    id: 1,
    start_at: new Date(2026, 9, 18, 9, 5),
    end_at: new Date(2026, 9, 20, 14, 30),
  },
  {
    id: 2,
    start_at: new Date(2026, 10, 2, 8, 0),
    end_at: new Date(2026, 10, 3, 16, 45),
  },
];

describe("ReservationHistoryCard", () => {
  it("renders the title, description, and max height", () => {
    render(<ReservationHistoryCard reservations={reservations} />);

    expect(
      screen.getByRole("heading", { name: "Reservation History" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("All the reservations for this unit.")
    ).toBeInTheDocument();

    expect(screen.getByTestId("max-height")).toHaveTextContent("350");
  });

  it("formats reservation dates without times by default", () => {
    render(<ReservationHistoryCard reservations={reservations} />);

    expect(screen.getByText("20261018")).toBeInTheDocument();
    expect(screen.getByText("20261020")).toBeInTheDocument();
    expect(screen.getByText("20261102")).toBeInTheDocument();
    expect(screen.getByText("20261103")).toBeInTheDocument();
  });

  it("includes times when showTime is true", () => {
    render(
      <ReservationHistoryCard reservations={reservations} showTime />
    );

    expect(screen.getByText("20261018 09:05")).toBeInTheDocument();
    expect(screen.getByText("20261020 14:30")).toBeInTheDocument();
    expect(screen.getByText("20261102 08:00")).toBeInTheDocument();
    expect(screen.getByText("20261103 16:45")).toBeInTheDocument();
  });

  it("renders every reservation", () => {
    const { container } = render(
      <ReservationHistoryCard reservations={reservations} />
    );

    expect(container.querySelectorAll(".font-mono")).toHaveLength(4);
  });

  it("renders an empty history when there are no reservations", () => {
    render(<ReservationHistoryCard reservations={[]} />);

    expect(
      screen.getByRole("heading", { name: "Reservation History" })
    ).toBeInTheDocument();

    expect(screen.queryByText("20261018")).not.toBeInTheDocument();
    expect(screen.queryByText("20261102")).not.toBeInTheDocument();
  });
});

