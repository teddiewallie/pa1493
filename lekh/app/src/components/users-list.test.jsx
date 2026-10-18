import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UsersList } from "./users-list";
import { UsersContext } from "@/context/users-context";

vi.mock("@/components/user-card", () => ({
  UserCard: ({ user }) => (
    <div data-testid="user-card">
      <span>{user.name}</span>
      <span>{user.email}</span>
    </div>
  ),
}));

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

const renderUsersList = (users) =>
  render(
    <UsersContext.Provider value={{ users }}>
      <UsersList />
    </UsersContext.Provider>
  );

describe("UsersList", () => {
  it("renders a card for each user", () => {
    renderUsersList(users);

    expect(screen.getAllByTestId("user-card")).toHaveLength(3);
  });

  it("renders each user's name and email", () => {
    renderUsersList(users);

    for (const user of users) {
      expect(screen.getByText(user.name)).toBeInTheDocument();
      expect(screen.getByText(user.email)).toBeInTheDocument();
    }
  });

  it("renders an empty list when there are no users", () => {
    renderUsersList([]);

    expect(screen.queryAllByTestId("user-card")).toHaveLength(0);
  });

  it("applies the expected responsive grid classes", () => {
    const { container } = renderUsersList(users);

    expect(container.firstChild).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
      "gap-8"
    );
  });
});

