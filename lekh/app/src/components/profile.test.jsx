import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Profile } from "./profile";

vi.mock("@/components/modal-with-toast", () => ({
  ModalWithToast: ({ title, message, onMessageHandled, children }) => (
    <section>
      <button onClick={onMessageHandled}>{title}</button>
      <p data-testid="toast-message">{message}</p>
      {children}
    </section>
  ),
}));

vi.mock("@/components/create-user-form", () => ({
  CreateUserForm: (props) => (
    <div>
      <button onClick={() => props.onSuccess({ id: 123 })}>
        Simulate edit success
      </button>
      <button onClick={props.onFail}>
        Simulate edit failure
      </button>
      <span data-testid="can-delete">{String(props.canDelete)}</span>
      <span data-testid="form-user">{props.user.name}</span>
    </div>
  ),
}));

vi.mock("@/components/user-card", () => ({
  UserCard: ({ user, single }) => (
    <div data-testid="user-card">
      {user.name} - single: {String(single)}
    </div>
  ),
}));

vi.mock("@/components/pendings-wrapper", () => ({
  PendingsWrapper: () => <div data-testid="pendings-wrapper" />,
}));

const student = {
  id: 2,
  name: "Alex Student",
  role_id: 2,
};

const maintainer = {
  id: 1,
  name: "Morgan Maintainer",
  role_id: 1,
};

const renderProfile = (props = {}) => {
  const defaults = {
    user: student,
    refresh: vi.fn(),
    canDelete: false,
    onDelete: vi.fn(),
  };

  return {
    ...defaults,
    ...props,
    ...render(<Profile {...defaults} {...props} />),
  };
};

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the edit action and user card", () => {
    renderProfile();

    expect(
      screen.getByRole("button", { name: "Edit User" })
    ).toBeInTheDocument();

    expect(screen.getByTestId("user-card"))
      .toHaveTextContent("Alex Student");
    expect(screen.getByTestId("user-card"))
      .toHaveTextContent("single: true");

    expect(screen.getByTestId("form-user"))
      .toHaveTextContent("Alex Student");
    expect(screen.getByTestId("can-delete"))
      .toHaveTextContent("false");
  });

  it("does not render pending requests for a non-maintainer", () => {
    renderProfile({ user: student });

    expect(screen.queryByTestId("pendings-wrapper"))
      .not.toBeInTheDocument();
  });

  it("renders pending requests for a maintainer", () => {
    renderProfile({ user: maintainer });

    expect(screen.getByTestId("pendings-wrapper"))
      .toBeInTheDocument();
  });

  it("sets the success message after a successful edit", () => {
    renderProfile();

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate edit success" })
    );

    expect(screen.getByTestId("toast-message"))
      .toHaveTextContent("User successfully edited.");
  });

  it("refreshes data after a maintainer successfully edits a user", () => {
    const refresh = vi.fn();

    renderProfile({ user: maintainer, refresh });

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate edit success" })
    );

    expect(refresh).toHaveBeenCalledWith({ id: 123 });
  });

  it("does not refresh data after a non-maintainer successfully edits a user", () => {
    const refresh = vi.fn();

    renderProfile({ user: student, refresh });

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate edit success" })
    );

    expect(refresh).not.toHaveBeenCalled();
  });

  it("sets the failure message when editing fails", () => {
    renderProfile();

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate edit failure" })
    );

    expect(screen.getByTestId("toast-message"))
      .toHaveTextContent("Failed to edit user.");
  });

  it("clears the message when the modal reports it handled", () => {
    renderProfile();

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate edit failure" })
    );

    expect(screen.getByTestId("toast-message"))
      .toHaveTextContent("Failed to edit user.");

    fireEvent.click(screen.getByRole("button", { name: "Edit User" }));

    expect(screen.getByTestId("toast-message")).toBeEmptyDOMElement();
  });

  it("passes the delete callback through to the user form", () => {
    const onDelete = vi.fn();

    renderProfile({ onDelete, canDelete: true });

    expect(screen.getByTestId("can-delete"))
      .toHaveTextContent("true");
  });
});

