import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EquipmentContext } from "@/context/equipment-context";
import { UserContext } from "@/context/user-context";
import { toast } from "@/components/ui/toast";
import Page from "./page";

vi.mock("@/components/group-card", () => ({
  GroupCard: ({ group }) => (
    <div data-testid="group-card">
      <span>{group.name}</span>
      <span>{group.description}</span>
    </div>
  ),
}));

vi.mock("@/components/modal-with-toast", () => ({
  ModalWithToast: ({ title, children }) => (
    <div data-testid="modal">
      <span>{title}</span>
      {children}
    </div>
  ),
}));

vi.mock("@/components/create-group-form", () => ({
  CreateGroupForm: ({ onSuccess, onFail }) => (
    <div data-testid="create-group-form">
      <button onClick={onSuccess}>Simulate success</button>
      <button onClick={onFail}>Simulate failure</button>
    </div>
  ),
}));

vi.mock("@/components/ui/toast", () => ({
  toast: {
    add: vi.fn(),
  },
}));

describe("Types page", () => {
  const groups = [
    { id: 1, name: "Computers", description: "Computer equipment" },
    { id: 2, name: "Sensors", description: "Sensor equipment" },
  ];

  let refreshGroups;

  const renderPage = (roleId = 2) =>
    render(
      <EquipmentContext.Provider
        value={{
          groups,
          refreshGroups,
        }}
      >
        <UserContext.Provider
          value={{
            user: { id: 7, role_id: roleId },
          }}
        >
          <Page />
        </UserContext.Provider>
      </EquipmentContext.Provider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    refreshGroups = vi.fn();
  });

  it("renders the page heading", () => {
    renderPage();

    expect(
      screen.getByText("All Types")
    ).toBeInTheDocument();
  });

  it("renders the All units card", () => {
    renderPage();

    expect(screen.getByText("All units")).toBeInTheDocument();
    expect(screen.getByText("List all units")).toBeInTheDocument();
  });

  it("renders all groups from the equipment context", () => {
    renderPage();

    expect(screen.getByText("Computers")).toBeInTheDocument();
    expect(screen.getByText("Computer equipment")).toBeInTheDocument();
    expect(screen.getByText("Sensors")).toBeInTheDocument();
    expect(screen.getByText("Sensor equipment")).toBeInTheDocument();

    expect(screen.getAllByTestId("group-card")).toHaveLength(3);
  });

  it("shows the Add Type form to maintainers", () => {
    renderPage(1);

    expect(screen.getByText("Add Type")).toBeInTheDocument();
    expect(screen.getByTestId("create-group-form")).toBeInTheDocument();
  });

  it("hides the Add Type form from regular users", () => {
    renderPage(2);

    expect(screen.queryByText("Add Type")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("create-group-form")
    ).not.toBeInTheDocument();
  });

  it("shows a success toast and refreshes groups after successful creation", async () => {
    const user = userEvent.setup();
    renderPage(1);

    await user.click(
      screen.getByRole("button", { name: "Simulate success" })
    );

    expect(toast.add).toHaveBeenCalledWith({
      title: "Type successfully added.",
    });

    expect(refreshGroups).toHaveBeenCalledOnce();
  });

  it("shows a failure toast when group creation fails", async () => {
    const user = userEvent.setup();
    renderPage(1);

    await user.click(
      screen.getByRole("button", { name: "Simulate failure" })
    );

    expect(toast.add).toHaveBeenCalledWith({
      title: "Failed to add type.",
    });

    expect(refreshGroups).not.toHaveBeenCalled();
  });
});
