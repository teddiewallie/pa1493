
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  auth,
  createUserSchema,
  addUserQuery,
  updateUserQuery,
  safeParse,
} = vi.hoisted(() => ({
  auth: vi.fn(),
  createUserSchema: vi.fn(),
  addUserQuery: vi.fn(),
  updateUserQuery: vi.fn(),
  safeParse: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));

vi.mock("@/schema/user-schema.js", () => ({
  createUserSchema,
}));

vi.mock("@/query/user-query.js", () => ({
  addUserQuery,
  updateUserQuery,
}));

import { saveUser } from "./save-user";

describe("saveUser", () => {
  const userData = {
    id: 2,
    name: "Test User",
    email: "test@example.com",
    role_id: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    createUserSchema.mockReturnValue({ safeParse });
    safeParse.mockReturnValue({ success: true });

    auth.mockResolvedValue({
      user: { id: 1, role_id: 1 },
    });

    addUserQuery.mockResolvedValue(true);
    updateUserQuery.mockResolvedValue(true);
  });

  it("creates a new user", async () => {
    const newUser = { ...userData };
    delete newUser.id;

    await expect(saveUser(newUser)).resolves.toBe(true);

    expect(createUserSchema).toHaveBeenCalledWith(false);
    expect(addUserQuery).toHaveBeenCalledWith(newUser);
    expect(updateUserQuery).not.toHaveBeenCalled();
  });

  it("updates an existing user as a maintainer", async () => {
    await expect(saveUser(userData)).resolves.toBe(true);

    expect(createUserSchema).toHaveBeenCalledWith(true);
    expect(updateUserQuery).toHaveBeenCalledWith(userData, true);
    expect(addUserQuery).not.toHaveBeenCalled();
  });

  it("allows a user to update their own account", async () => {
    auth.mockResolvedValue({
      user: { id: 2, role_id: 2 },
    });

    await expect(saveUser(userData)).resolves.toBe(true);

    expect(updateUserQuery).toHaveBeenCalledWith(userData, false);
  });

  it("returns false when validation fails", async () => {
    safeParse.mockReturnValue({ success: false });

    await expect(saveUser(userData)).resolves.toBe(false);

    expect(addUserQuery).not.toHaveBeenCalled();
    expect(updateUserQuery).not.toHaveBeenCalled();
  });

  it("returns false when there is no session", async () => {
    auth.mockResolvedValue(null);

    await expect(saveUser(userData)).resolves.toBe(false);

    expect(addUserQuery).not.toHaveBeenCalled();
    expect(updateUserQuery).not.toHaveBeenCalled();
  });

  it("prevents a regular user from updating another user", async () => {
    auth.mockResolvedValue({
      user: { id: 3, role_id: 2 },
    });

    await expect(saveUser(userData)).resolves.toBe(false);

    expect(updateUserQuery).not.toHaveBeenCalled();
  });

  it("returns false when adding a user fails", async () => {
    const newUser = { ...userData };
    delete newUser.id;

    addUserQuery.mockRejectedValue(new Error("Database error"));

    await expect(saveUser(newUser)).resolves.toBe(false);
  });

  it("returns false when updating a user fails", async () => {
    updateUserQuery.mockRejectedValue(new Error("Database error"));

    await expect(saveUser(userData)).resolves.toBe(false);
  });

  it("returns the query result when adding a user", async () => {
    addUserQuery.mockResolvedValue(false);

    const newUser = { ...userData };
    delete newUser.id;

    await expect(saveUser(newUser)).resolves.toBe(false);
  });

  it("returns the query result when updating a user", async () => {
    updateUserQuery.mockResolvedValue(false);

    await expect(saveUser(userData)).resolves.toBe(false);
  });
});

