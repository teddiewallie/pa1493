// src/components/profile.test.jsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Profile } from "@/components/profile";
import { toast } from "@/components/ui/toast";

vi.mock("@/components/modal-with-toast", () => ({
  ModalWithToast: ({ title, children }) => (
    <div data-testid="modal-with-toast" data-title={title}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/create-user-form", () => ({
  CreateUserForm: (props) => (
    <div data-testid="create-user-form">
      <span data-testid="can-delete">{String(props.canDelete)}</span>
      <button type="button" onClick={props.onSuccess}>
        Simulate edit success
      </button>
      <button type="button" onClick={props.onFail}>
        Simulate edit failure
      </button>
      <button type="button" onClick={props.onDelete}>
        Simulate delete
      </button>
      <span data-testid="form-user">{props.user?.name}</span>
    </div>
  ),
}));

vi.mock("@/components/user-card", () => ({
  UserCard: ({ user, single }) => (
    <div data-testid="user-card" data-single={String(single)}>
      {user?.name}
    </div>
  ),
}));

vi.mock("@/components/pendings-wrapper", () => ({
  PendingsWrapper: () => <div data-testid="pendings-wrapper" />,
}));

vi.mock("@/components/ui/toast", () => ({
  toast: {
    add: vi.fn(),
  },
}));

describe("Profile", () => {
  const user = {
    id: 42,
    name: "Test User",
    role_id: 2,
  };

  let refresh;
  let onDelete;

  beforeEach(() => {
    vi.clearAllMocks();
    refresh = vi.fn();
    onDelete = vi.fn();
  });

  const renderProfile = (props = {}) =>
    render(
      <Profile
        user={user}
        refresh={refresh}
        canDelete={false}
        onDelete={onDelete}
        {...props}
      />
    );

  it("renders the Edit User modal and form", () => {
    renderProfile();

    expect(screen.getByTestId("modal-with-toast")).toHaveAttribute(
      "data-title",
      "Edit User"
    );
    expect(screen.getByTestId("create-user-form")).toBeInTheDocument();
  });

  it("passes canDelete, user, and onDelete to CreateUserForm", () => {
    renderProfile({ canDelete: true });

    expect(screen.getByTestId("can-delete")).toHaveTextContent("true");
    expect(screen.getByTestId("form-user")).toHaveTextContent("Test User");

    fireEvent.click(screen.getByRole("button", { name: "Simulate delete" }));

    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("renders the UserCard with the user and single prop", () => {
    renderProfile();

    expect(screen.getByTestId("user-card")).toHaveAttribute(
      "data-single",
      "true"
    );
    expect(screen.getByTestId("user-card")).toHaveTextContent("Test User");
  });

  it("shows PendingsWrapper for a user with role_id 1", () => {
    renderProfile({ user: { ...user, role_id: 1 } });

    expect(screen.getByTestId("pendings-wrapper")).toBeInTheDocument();
  });

  it("does not show PendingsWrapper for a user without role_id 1", () => {
    renderProfile();

    expect(screen.queryByTestId("pendings-wrapper")).not.toBeInTheDocument();
  });

  it("shows a success toast and refreshes after a successful edit", () => {
    renderProfile();

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate edit success" })
    );

    expect(toast.add).toHaveBeenCalledWith({
      title: "User successfully edited.",
    });
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("shows a failure toast without refreshing after a failed edit", () => {
    renderProfile();

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate edit failure" })
    );

    expect(toast.add).toHaveBeenCalledWith({
      title: "Failed to edit user.",
    });
    expect(refresh).not.toHaveBeenCalled();
  });
});
