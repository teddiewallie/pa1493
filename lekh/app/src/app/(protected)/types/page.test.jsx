
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const { refreshGroups } = vi.hoisted(() => ({
  refreshGroups: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/components/group-card", () => ({
  GroupCard: ({ group }) => (
    <div data-testid="group-card">
      <span>{group.name}</span>
      <span>{group.description}</span>
    </div>
  ),
}));

vi.mock("@/components/modal-with-toast", () => ({
  ModalWithToast: ({ title, message, onMessageHandled, children }) => (
    <section>
      <h2>{title}</h2>
      <p data-testid="modal-message">{message}</p>
      <button onClick={onMessageHandled}>Dismiss message</button>
      {children}
    </section>
  ),
}));

vi.mock("@/components/create-group-form", () => ({
  CreateGroupForm: ({ onSuccess, onFail }) => (
    <div>
      <button onClick={onSuccess}>Simulate success</button>
      <button onClick={onFail}>Simulate failure</button>
    </div>
  ),
}));

import { EquipmentContext } from "@/context/equipment-context";
import { UserContext } from "@/context/user-context";
import Page from "./page";

const groups = [
  { id: 1, name: "Sensors", description: "Sensor equipment" },
  { id: 2, name: "Cameras", description: "Camera equipment" },
];

const renderPage = (user = { id: 1, role_id: 2 }) =>
  render(
    <UserContext.Provider value={{ user }}>
      <EquipmentContext.Provider value={{ groups, refreshGroups }}>
        <Page />
      </EquipmentContext.Provider>
    </UserContext.Provider>,
  );

describe("Types page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page heading, All units card, and all type cards", () => {
    renderPage();

    expect(screen.getByText("All Types")).toBeTruthy();
    expect(screen.getByText("All units")).toBeTruthy();
    expect(screen.getByText("List all units")).toBeTruthy();
    expect(screen.getByText("Sensors")).toBeTruthy();
    expect(screen.getByText("Sensor equipment")).toBeTruthy();
    expect(screen.getByText("Cameras")).toBeTruthy();
    expect(screen.getByText("Camera equipment")).toBeTruthy();

    expect(screen.getAllByTestId("group-card")).toHaveLength(3);
  });

  it("does not show the add-type form to a student", () => {
    renderPage({ id: 2, role_id: 2 });

    expect(screen.queryByText("Add Type")).toBeNull();
    expect(screen.queryByRole("button", { name: "Simulate success" })).toBeNull();
  });

  it("shows the add-type form to a maintainer", () => {
    renderPage({ id: 1, role_id: 1 });

    expect(screen.getByText("Add Type")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Simulate success" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Simulate failure" })).toBeTruthy();
  });

  it("refreshes groups and displays a success message after creating a type", () => {
    renderPage({ id: 1, role_id: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Simulate success" }));

    expect(refreshGroups).toHaveBeenCalledOnce();
    expect(screen.getByTestId("modal-message").textContent).toBe(
      "Type successfully added.",
    );
  });

  it("displays a failure message when creating a type fails", () => {
    renderPage({ id: 1, role_id: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Simulate failure" }));

    expect(refreshGroups).not.toHaveBeenCalled();
    expect(screen.getByTestId("modal-message").textContent).toBe(
      "Failed to add type.",
    );
  });

  it("clears the message when the modal handles it", () => {
    renderPage({ id: 1, role_id: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Simulate failure" }));

    expect(screen.getByTestId("modal-message").textContent).toBe(
      "Failed to add type.",
    );

    fireEvent.click(screen.getByRole("button", { name: "Dismiss message" }));

    expect(screen.getByTestId("modal-message").textContent).toBe("");
  });
});

