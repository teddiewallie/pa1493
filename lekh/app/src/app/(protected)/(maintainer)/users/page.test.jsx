import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";

vi.mock("@/components/modal-with-toast", () => ({
  ModalWithToast: ({ title, message, children }) => (
    <section>
      <h1>{title}</h1>
      <p data-testid="toast-message">{message}</p>
      {children}
    </section>
  ),
}));

vi.mock("@/components/create-user-form", () => ({
  CreateUserForm: ({ onSuccess, onFail }) => (
    <div data-testid="create-user-form">
      <button onClick={onSuccess}>Create success</button>
      <button onClick={onFail}>Create failure</button>
    </div>
  ),
}));

vi.mock("@/components/users-list", () => ({
  UsersList: () => <div data-testid="users-list">Users list</div>,
}));

describe("Users page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the create-user modal and users list", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { name: "Create User" }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("create-user-form")).toBeInTheDocument();
    expect(screen.getByTestId("users-list")).toBeInTheDocument();
  });

  it("shows a success message when a user is created", () => {
    render(<Page />);

    fireEvent.click(screen.getByRole("button", { name: "Create success" }));

    expect(screen.getByTestId("toast-message")).toHaveTextContent(
      "User successfully created.",
    );
  });

  it("shows a failure message when user creation fails", () => {
    render(<Page />);

    fireEvent.click(screen.getByRole("button", { name: "Create failure" }));

    expect(screen.getByTestId("toast-message")).toHaveTextContent(
      "Failed to create user.",
    );
  });

  it("starts with an empty message", () => {
    render(<Page />);

    expect(screen.getByTestId("toast-message")).toBeEmptyDOMElement();
  });

  it("updates the message when creation callbacks are invoked successively", () => {
    render(<Page />);

    const message = screen.getByTestId("toast-message");

    fireEvent.click(screen.getByRole("button", { name: "Create success" }));
    expect(message).toHaveTextContent("User successfully created.");

    fireEvent.click(screen.getByRole("button", { name: "Create failure" }));
    expect(message).toHaveTextContent("Failed to create user.");
  });
});

