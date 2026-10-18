
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GroupCard } from "./group-card";
import { EquipmentContext } from "@/context/equipment-context";
import { ReservationsContext } from "@/context/reservations-context";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props) => <img {...props} />,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardDescription: ({ children }) => <p>{children}</p>,
  CardFooter: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <h2>{children}</h2>,
}));

vi.mock("@/components/item-status", () => ({
  ItemStatus: ({ name, extra }) => (
    <div data-testid="item-status">
      <span>{name}</span>
      <span>{extra}</span>
    </div>
  ),
}));

const renderComponent = ({
  group = { id: 1, name: "Sensors", description: "Measurement equipment" },
  items = [],
  reservations = [],
} = {}) =>
  render(
    <EquipmentContext.Provider value={{ items }}>
      <ReservationsContext.Provider value={{ reservations }}>
        <GroupCard group={group} />
      </ReservationsContext.Provider>
    </EquipmentContext.Provider>
  );

const makeItem = (overrides = {}) => ({
  id: 10,
  group_id: 1,
  asset_id: 123,
  status_name: "Available",
  ...overrides,
});

const makeReservation = (overrides = {}) => ({
  item_id: 10,
  start_at: new Date(Date.now() - 60 * 60 * 1000),
  end_at: new Date(Date.now() + 60 * 60 * 1000),
  returned_at: null,
  ...overrides,
});

describe("GroupCard", () => {
  it("renders nothing when group is missing", () => {
    const { container } = renderComponent({ group: null });

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("renders group details and links to its units", () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: "Sensors" })).toBeInTheDocument();
    expect(screen.getByText("Measurement equipment")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/units/by-type/1");
  });

  it("uses the first item's asset for the group image", () => {
    renderComponent({
      items: [
        makeItem({ id: 10, asset_id: 123 }),
        makeItem({ id: 11, asset_id: 456 }),
      ],
    });

    expect(screen.getByRole("img", { name: "Sensors" })).toHaveAttribute(
      "src",
      "/api/asset/123"
    );
  });

  it("counts only available items belonging to the group", () => {
    renderComponent({
      items: [
        makeItem({ id: 10 }),
        makeItem({ id: 11 }),
        makeItem({ id: 12, status_name: "On Loan" }),
        makeItem({ id: 13, group_id: 2 }),
      ],
    });

    expect(screen.getByTestId("item-status")).toHaveTextContent("Available");
    expect(screen.getByTestId("item-status")).toHaveTextContent("2/3");
  });

  it("excludes items with an active reservation from the available count", () => {
    renderComponent({
      items: [makeItem({ id: 10 }), makeItem({ id: 11 })],
      reservations: [
        makeReservation({ item_id: 10 }),
      ],
    });

    expect(screen.getByTestId("item-status")).toHaveTextContent("1/2");
  });

  it("does not exclude items with only future reservations", () => {
    renderComponent({
      items: [makeItem({ id: 10 })],
      reservations: [
        makeReservation({
          start_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }),
      ],
    });

    expect(screen.getByTestId("item-status")).toHaveTextContent("1/1");
  });

  it("does not exclude items whose reservations have been returned", () => {
    renderComponent({
      items: [makeItem({ id: 10 })],
      reservations: [
        makeReservation({
          returned_at: new Date(),
        }),
      ],
    });

    expect(screen.getByTestId("item-status")).toHaveTextContent("1/1");
  });

  it("marks the group unavailable when no items are available", () => {
    renderComponent({
      items: [
        makeItem({ id: 10, status_name: "On Loan" }),
      ],
    });

    expect(screen.getByTestId("item-status")).toHaveTextContent("Unavailable");
    expect(screen.getByTestId("item-status")).toHaveTextContent("0/1");
  });

  it("shows all equipment for group zero and uses asset zero", () => {
    renderComponent({
      group: { id: 0, name: "Ungrouped", description: "No group assigned" },
      items: [
        makeItem({ id: 10, group_id: 1, asset_id: 123 }),
        makeItem({ id: 11, group_id: 2, asset_id: 456 }),
      ],
    });

    expect(screen.getByRole("heading", { name: "Ungrouped" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/units/by-type/0");
    expect(screen.getByRole("img", { name: "Ungrouped" })).toHaveAttribute(
      "src",
      "/api/asset/0"
    );
    expect(screen.getByTestId("item-status")).toHaveTextContent("2/2");
  });
});

