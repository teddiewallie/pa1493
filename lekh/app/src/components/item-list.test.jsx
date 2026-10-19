
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ItemList } from "./item-list";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/components/modal-with-toast", () => ({
  ModalWithToast: ({ children, title }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock("@/components/create-item-form", () => ({
  CreateItemForm: (props) => (
    <div data-testid="create-item-form">
      <button type="button" onClick={props.onSuccess}>Create successfully</button>
      <button type="button" onClick={props.onFail}>Create unsuccessfully</button>
      <span data-testid="statuses">{JSON.stringify(props.statuses)}</span>
      <span data-testid="group-id">{String(props.groupId)}</span>
    </div>
  ),
}));

vi.mock("@/components/item-card", () => ({
  ItemCard: ({ item, pointer }) => (
    <div data-testid="item-card" data-item-id={item.id} data-pointer={String(pointer)}>
      {item.name}
    </div>
  ),
}));

const items = [
  { id: 1, group_id: 10, name: "Oscilloscope" },
  { id: 2, group_id: 20, name: "Camera" },
  { id: 3, group_id: 10, name: "Multimeter" },
];

const renderComponent = ({
  user = { id: 1, role_id: 1 },
  equipmentItems = items,
  groupId,
  children,
  extraCards,
  refreshItems = vi.fn(),
  onMessageHandled = vi.fn(),
} = {}) => {
  const result = render(
    <UserContext.Provider value={{ user }}>
      <EquipmentContext.Provider
        value={{
          groups: [],
          items: equipmentItems,
          refreshItems,
          meta: { status: [{ id: 1, name: "Available" }] },
        }}
      >
        <ItemList
          groupId={groupId}
          extraCards={extraCards}
          onMessageHandled={onMessageHandled}
        >
          {children}
        </ItemList>
      </EquipmentContext.Provider>
    </UserContext.Provider>
  );

  return { ...result, refreshItems, onMessageHandled };
};

describe("ItemList", () => {
  it("renders all items when no group ID is provided", () => {
    renderComponent();

    expect(screen.getAllByTestId("item-card")).toHaveLength(3);
    expect(screen.getByText("Oscilloscope")).toBeInTheDocument();
    expect(screen.getByText("Camera")).toBeInTheDocument();
    expect(screen.getByText("Multimeter")).toBeInTheDocument();
  });

  it("filters items by group ID", () => {
    renderComponent({ groupId: 10 });

    expect(screen.getAllByTestId("item-card")).toHaveLength(2);
    expect(screen.getByText("Oscilloscope")).toBeInTheDocument();
    expect(screen.getByText("Multimeter")).toBeInTheDocument();
    expect(screen.queryByText("Camera")).not.toBeInTheDocument();
  });

  it("passes pointer=true to each item card", () => {
    renderComponent();

    for (const card of screen.getAllByTestId("item-card")) {
      expect(card).toHaveAttribute("data-pointer", "true");
    }
  });

  it("renders children and extra cards", () => {
    renderComponent({
      children: <div>Custom header</div>,
      extraCards: <div>Extra card</div>,
    });

    expect(screen.getByText("Custom header")).toBeInTheDocument();
    expect(screen.getByText("Extra card")).toBeInTheDocument();
  });

  it("shows the Add Unit form to maintainers", () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: "Add Unit" })).toBeInTheDocument();
    expect(screen.getByTestId("create-item-form")).toBeInTheDocument();
    expect(screen.getByTestId("statuses")).toHaveTextContent(
      JSON.stringify([{ id: 1, name: "Available" }])
    );
  });

  it("passes the group ID to the creation form", () => {
    renderComponent({ groupId: 10 });

    expect(screen.getByTestId("group-id")).toHaveTextContent("10");
  });

  it("hides the Add Unit form from non-maintainers", () => {
    renderComponent({ user: { id: 2, role_id: 2 } });

    expect(screen.queryByRole("heading", { name: "Add Unit" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("create-item-form")).not.toBeInTheDocument();
  });

  it("refreshes items when creation succeeds", () => {
    const refreshItems = vi.fn();
    renderComponent({ refreshItems });

    screen.getByRole("button", { name: "Create successfully" }).click();

    expect(refreshItems).toHaveBeenCalledTimes(1);
  });

  it("does not refresh items when creation fails", () => {
    const refreshItems = vi.fn();
    renderComponent({ refreshItems });

    screen.getByRole("button", { name: "Create unsuccessfully" }).click();

    expect(refreshItems).not.toHaveBeenCalled();
  });
});

