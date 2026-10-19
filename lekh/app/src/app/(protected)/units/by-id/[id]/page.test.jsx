
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const {
  router,
  setReturnedMock,
  refreshItems,
  refreshReservations,
  addToast,
} = vi.hoisted(() => ({
  router: { back: vi.fn(), push: vi.fn() },
  setReturnedMock: vi.fn(),
  refreshItems: vi.fn(),
  refreshReservations: vi.fn(),
  addToast: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, use: (value) => value };
});

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("lucide-react", () => ({
  CircleArrowLeft: () => <span data-testid="back-icon" />,
}));

vi.mock("@/components/item-card", () => ({
  ItemCard: ({ item, activeReservation }) => (
    <div data-testid="item-card">
      {item?.name}
      {activeReservation && <span>Active reservation</span>}
    </div>
  ),
}));

vi.mock("@/components/modal-with-toast", () => ({
  ModalWithToast: ({ title, message, children }) => (
    <section>
      <h2>{title}</h2>
      <p data-testid={`message-${title}`}>{message}</p>
      {children}
    </section>
  ),
}));

vi.mock("@/components/create-item-form", () => ({
  CreateItemForm: ({ onSuccess, onFail, statuses }) => (
    <div>
      <span data-testid="statuses">{JSON.stringify(statuses)}</span>
      <button onClick={onSuccess}>Simulate edit success</button>
      <button onClick={onFail}>Simulate edit failure</button>
    </div>
  ),
}));

vi.mock("@/components/report-item-form", () => ({
  ReportItemForm: ({ onSuccess, onFail }) => (
    <div>
      <button onClick={onSuccess}>Simulate report success</button>
      <button onClick={onFail}>Simulate report failure</button>
    </div>
  ),
}));

vi.mock("@/components/simple-card", () => ({
  SimpleCard: ({ title, content }) => (
    <div data-testid="simple-card">
      <span>{title}</span>
      <span>{content}</span>
    </div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock("@/components/link-button", () => ({
  LinkButton: ({ href, children }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/article-list", () => ({
  ArticleList: ({ title, articles }) => (
    <div data-testid="article-list">
      <span>{title}</span>
      {articles.map((article) => <span key={article.id}>{article.title}</span>)}
    </div>
  ),
}));

vi.mock("@/components/reservation-card", () => ({
  ReservationCard: ({ item }) => (
    <div data-testid="reservation-card">{item.name}</div>
  ),
}));

vi.mock("@/components/reservation-history-card", () => ({
  ReservationHistoryCard: ({ reservations, showTime }) => (
    <div data-testid={showTime ? "timed-history" : "history"}>
      {reservations.length} reservations
    </div>
  ),
}));

vi.mock("@/service/set-returned", () => ({
  setReturned: setReturnedMock,
}));

vi.mock("@/components/ui/toast", () => ({
  toast: { add: addToast },
}));

import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ArticleContext } from "@/context/article-context";
import { ReservationsContext } from "@/context/reservations-context";
import Page from "./page";

const item = {
  id: 10,
  name: "Oscilloscope",
  serial: "SCOPE-123",
  group_id: 20,
  known_issues: "Probe connector is loose.",
  borrowable: true,
  bookable: true,
  status_name: "Available",
};

const group = {
  id: 20,
  name: "Measurement Equipment",
  known_issues: "Handle with care.",
};

const articles = [
  { id: 1, title: "Unit guide", item_id: 10, group_id: null },
  { id: 2, title: "Type guide", item_id: null, group_id: 20 },
  { id: 3, title: "Unrelated guide", item_id: 99, group_id: 99 },
];

const activeReservation = {
  id: 50,
  item_id: 10,
  start_at: "2020-01-01T10:00:00.000Z",
  returned_at: null,
  is_pending: false,
};

const renderPage = ({
  user = { id: 1, role_id: 1 },
  items = [item],
  groups = [group],
  articleData = articles,
  reservations = [],
  meta = { status: [{ id: 1, name: "Available" }] },
} = {}) =>
  render(
    <UserContext.Provider value={{ user }}>
      <EquipmentContext.Provider
        value={{ items, groups, refreshItems, meta }}
      >
        <ArticleContext.Provider
          value={{ articles: articleData, articleTypes: [{ id: 1, name: "Guide" }] }}
        >
          <ReservationsContext.Provider
            value={{ reservations, refreshReservations }}
          >
            <Page params={{ id: "10" }} />
          </ReservationsContext.Provider>
        </ArticleContext.Provider>
      </EquipmentContext.Provider>
    </UserContext.Provider>,
  );

describe("Unit detail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setReturnedMock.mockResolvedValue(true);
  });

  it("renders the unit, its group link, and the item card", () => {
    renderPage({ user: { id: 2, role_id: 2 } });

    expect(
      screen.getByRole("link", {
        name: /Measurement Equipment \/ Oscilloscope - SCOPE-123/i,
      }).getAttribute("href"),
    ).toBe("/units/by-type/20");

    expect(screen.getByTestId("item-card").textContent).toContain("Oscilloscope");
  });

  it("shows the add-article and edit-unit actions only to maintainers", () => {
    const { rerender } = renderPage({
      user: { id: 2, role_id: 2 },
    });

    expect(screen.queryByRole("link", { name: "Add Article" })).toBeNull();
    expect(screen.queryByText("Edit Unit")).toBeNull();

    rerender(
      <UserContext.Provider value={{ user: { id: 1, role_id: 1 } }}>
        <EquipmentContext.Provider value={{ items: [item], groups: [group], refreshItems, meta: { status: [] } }}>
          <ArticleContext.Provider value={{ articles, articleTypes: [] }}>
            <ReservationsContext.Provider value={{ reservations: [], refreshReservations }}>
              <Page params={{ id: "10" }} />
            </ReservationsContext.Provider>
          </ArticleContext.Provider>
        </EquipmentContext.Provider>
      </UserContext.Provider>,
    );

    expect(screen.getByRole("link", { name: "Add Article" }).getAttribute("href"))
      .toBe("/editor/for-unit/10");
    expect(screen.getByText("Edit Unit")).toBeTruthy();
  });

  it("renders matching unit and type articles and known issues", () => {
    renderPage({ user: { id: 2, role_id: 2 } });

    expect(screen.getByText("Unit Articles")).toBeTruthy();
    expect(screen.getByText("Unit guide")).toBeTruthy();
    expect(screen.getByText("Type Articles")).toBeTruthy();
    expect(screen.getByText("Type guide")).toBeTruthy();
    expect(screen.queryByText("Unrelated guide")).toBeNull();

    expect(screen.getByText("Known Unit Issues")).toBeTruthy();
    expect(screen.getByText("Probe connector is loose.")).toBeTruthy();
    expect(screen.getByText("Known Type Issues")).toBeTruthy();
    expect(screen.getByText("Handle with care.")).toBeTruthy();
  });

  it("shows reservation actions according to item capabilities", () => {
    renderPage({ user: { id: 2, role_id: 2 } });

    expect(screen.getAllByTestId("reservation-card")).toHaveLength(2);
  });

  it("shows reservation history for borrowable and bookable items with reservations", () => {
    renderPage({
      user: { id: 2, role_id: 2 },
      reservations: [activeReservation],
    });

    expect(screen.getByTestId("history").textContent).toBe("1 reservations");
    expect(screen.getByTestId("timed-history").textContent).toBe("1 reservations");
  });

  it("shows Mark as Returned for a maintainer with an active, non-pending reservation", () => {
    renderPage({ reservations: [activeReservation] });

    expect(screen.getByRole("button", { name: "Mark as Returned" })).toBeTruthy();
    expect(screen.getByTestId("item-card").textContent).toContain("Active reservation");
  });

  it("marks a reservation as returned and refreshes item and reservation data", async () => {
    renderPage({ reservations: [activeReservation] });

    fireEvent.click(screen.getByRole("button", { name: "Mark as Returned" }));

    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        title: "Item marked as returned.",
      });
    });

    expect(setReturnedMock).toHaveBeenCalledWith(50);
    expect(refreshItems).toHaveBeenCalledOnce();
    expect(refreshReservations).toHaveBeenCalledOnce();
  });

  it("shows a failure toast when marking a reservation as returned fails", async () => {
    setReturnedMock.mockResolvedValue(false);
    renderPage({ reservations: [activeReservation] });

    fireEvent.click(screen.getByRole("button", { name: "Mark as Returned" }));

    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        title: "Failed to mark item as returned.",
      });
    });

    expect(refreshItems).not.toHaveBeenCalled();
    expect(refreshReservations).not.toHaveBeenCalled();
  });

  it("does not offer Mark as Returned to students", () => {
    renderPage({
      user: { id: 2, role_id: 2 },
      reservations: [activeReservation],
    });

    expect(screen.queryByRole("button", { name: "Mark as Returned" })).toBeNull();
  });

  it("does not offer Mark as Returned for a pending reservation", () => {
    renderPage({
      reservations: [{ ...activeReservation, is_pending: true }],
    });

    expect(screen.queryByRole("button", { name: "Mark as Returned" })).toBeNull();
  });

  it("refreshes items and shows a success message after reporting an issue", () => {
    renderPage({ user: { id: 2, role_id: 2 } });

    fireEvent.click(screen.getByRole("button", { name: "Simulate report success" }));

    expect(refreshItems).toHaveBeenCalledOnce();
    expect(screen.getByTestId("message-Report Issue").textContent)
      .toBe("Successfully reported item.");
  });

  it("shows a failure message when reporting an issue fails", () => {
    renderPage({ user: { id: 2, role_id: 2 } });

    fireEvent.click(screen.getByRole("button", { name: "Simulate report failure" }));

    expect(screen.getByTestId("message-Report Issue").textContent)
      .toBe("Failed to report item.");
    expect(refreshItems).not.toHaveBeenCalled();
  });

  it("refreshes items and shows a success message after editing a unit", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Simulate edit success" }));

    expect(refreshItems).toHaveBeenCalledOnce();
    expect(screen.getByTestId("message-Edit Unit").textContent)
      .toBe("Item successfully edited.");
  });

  it("shows a failure message when editing a unit fails", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Simulate edit failure" }));

    expect(screen.getByTestId("message-Edit Unit").textContent)
      .toBe("Failed to edit item.");
    expect(refreshItems).not.toHaveBeenCalled();
  });
});

