
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { query, hash } = vi.hoisted(() => ({
  query: vi.fn(),
  hash: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: { query },
}));

vi.mock("bcrypt", () => ({
  default: { hash },
}));

import {
  getAllUsersQuery,
  getUsersByEmailQuery,
  getUsersByIdQuery,
  addUserQuery,
  updateUserQuery,
  deleteUserQuery,
} from "./user-query";

beforeEach(() => {
  vi.clearAllMocks();
  hash.mockResolvedValue("hashed-password");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getUsersByEmailQuery", () => {
  it("returns matching non-deleted users with password hashes", async () => {
    const users = [
      {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashed-password",
        role_id: 2,
      },
    ];
    query.mockResolvedValue(users);

    await expect(getUsersByEmailQuery("test@example.com")).resolves.toEqual(users);

    expect(query).toHaveBeenCalledWith(
      "SELECT id, name, email, password, role_id FROM user WHERE email=? AND deleted=FALSE",
      ["test@example.com"],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(getUsersByEmailQuery("test@example.com")).rejects.toThrow(
      "Database error",
    );
  });
});

describe("getUsersByIdQuery", () => {
  it("returns the matching non-deleted user without the password hash", async () => {
    const users = [
      { id: 7, name: "Test User", email: "test@example.com", role_id: 2 },
    ];
    query.mockResolvedValue(users);

    await expect(getUsersByIdQuery(7)).resolves.toEqual(users);

    expect(query).toHaveBeenCalledWith(
      "SELECT id, name, email, role_id FROM user WHERE id=? AND deleted=FALSE",
      [7],
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(getUsersByIdQuery(7)).rejects.toThrow("Database error");
  });
});

describe("getAllUsersQuery", () => {
  it("returns all non-deleted users without password hashes", async () => {
    const users = [
      { id: 1, name: "Maintainer", email: "admin@example.com", deleted: 0, role_id: 1 },
      { id: 2, name: "Student", email: "student@example.com", deleted: 0, role_id: 2 },
    ];
    query.mockResolvedValue(users);

    await expect(getAllUsersQuery()).resolves.toEqual(users);

    expect(query).toHaveBeenCalledWith(
      "SELECT id, name, email, deleted, role_id FROM user WHERE deleted=FALSE",
    );
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(getAllUsersQuery()).rejects.toThrow("Database error");
  });
});

describe("addUserQuery", () => {
  it("hashes the password and inserts a regular user", async () => {
    query.mockResolvedValue({ insertId: 42 });

    await expect(
      addUserQuery({
        name: "Test User",
        email: "test@example.com",
        password: "plain-password",
        maintainer: false,
      }),
    ).resolves.toBeUndefined();

    expect(hash).toHaveBeenCalledWith("plain-password", 12);
    expect(query).toHaveBeenCalledWith(
      "INSERT INTO user (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      ["Test User", "test@example.com", "hashed-password", 2],
    );
  });

  it("assigns role 1 to a maintainer", async () => {
    query.mockResolvedValue({ insertId: 42 });

    await addUserQuery({
      name: "Maintainer",
      email: "admin@example.com",
      password: "plain-password",
      maintainer: true,
    });

    expect(query).toHaveBeenCalledWith(
      "INSERT INTO user (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      ["Maintainer", "admin@example.com", "hashed-password", 1],
    );
  });

  it("propagates password hashing errors without inserting a user", async () => {
    hash.mockRejectedValue(new Error("Hashing failed"));

    await expect(
      addUserQuery({
        name: "Test User",
        email: "test@example.com",
        password: "plain-password",
        maintainer: false,
      }),
    ).rejects.toThrow("Hashing failed");

    expect(query).not.toHaveBeenCalled();
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(
      addUserQuery({
        name: "Test User",
        email: "test@example.com",
        password: "plain-password",
        maintainer: false,
      }),
    ).rejects.toThrow("Database error");
  });
});

describe("updateUserQuery", () => {
  const data = {
    id: 7,
    name: "Updated User",
    email: "updated@example.com",
    maintainer: false,
  };

  it("updates user details without changing the role for a non-admin", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await expect(updateUserQuery(data, false)).resolves.toBe(true);

    expect(query).toHaveBeenCalledWith(
      "UPDATE user SET name=?, email=?, role_id=? WHERE id=?",
      ["Updated User", "updated@example.com", 2, 7],
    );
    expect(hash).not.toHaveBeenCalled();
  });

  it("allows an admin to assign the maintainer role", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await updateUserQuery({ ...data, maintainer: true }, true);

    expect(query).toHaveBeenCalledWith(
      "UPDATE user SET name=?, email=?, role_id=? WHERE id=?",
      ["Updated User", "updated@example.com", 1, 7],
    );
  });

  it("does not allow a non-admin to assign the maintainer role", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await updateUserQuery({ ...data, maintainer: true }, false);

    expect(query).toHaveBeenCalledWith(
      "UPDATE user SET name=?, email=?, role_id=? WHERE id=?",
      ["Updated User", "updated@example.com", 2, 7],
    );
  });

  it("hashes and updates a supplied password", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await updateUserQuery({ ...data, password: "new-password" }, false);

    expect(hash).toHaveBeenCalledWith("new-password", 12);
    expect(query).toHaveBeenCalledWith(
      "UPDATE user SET name=?, email=?, password=?, role_id=? WHERE id=?",
      ["Updated User", "updated@example.com", "hashed-password", 2, 7],
    );
  });

  it("does not change the password when it is empty", async () => {
    query.mockResolvedValue({ affectedRows: 1 });

    await updateUserQuery({ ...data, password: "" }, false);

    expect(hash).not.toHaveBeenCalled();
    expect(query).toHaveBeenCalledWith(
      "UPDATE user SET name=?, email=?, role_id=? WHERE id=?",
      ["Updated User", "updated@example.com", 2, 7],
    );
  });

  it("propagates password hashing errors without updating the user", async () => {
    hash.mockRejectedValue(new Error("Hashing failed"));

    await expect(
      updateUserQuery({ ...data, password: "new-password" }, false),
    ).rejects.toThrow("Hashing failed");

    expect(query).not.toHaveBeenCalled();
  });

  it("propagates database errors", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(updateUserQuery(data, false)).rejects.toThrow(
      "Database error",
    );
  });
});

describe("deleteUserQuery", () => {
  it("soft-deletes a user when multiple elevated users exist", async () => {
    query
      .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
      .mockResolvedValueOnce({ affectedRows: 1 });

    await expect(deleteUserQuery(7)).resolves.toBeUndefined();

    expect(query).toHaveBeenNthCalledWith(
      1,
      "SELECT id FROM user WHERE role_id=1",
    );
    expect(query).toHaveBeenNthCalledWith(
      2,
      "UPDATE user SET deleted=? WHERE id=?",
      [1, 7],
    );
  });

  it("soft-deletes a user when there are no elevated users", async () => {
    query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ affectedRows: 1 });

    await expect(deleteUserQuery(7)).resolves.toBeUndefined();

    expect(query).toHaveBeenCalledTimes(2);
    expect(query).toHaveBeenLastCalledWith(
      "UPDATE user SET deleted=? WHERE id=?",
      [1, 7],
    );
  });

  it("rejects deletion when exactly one elevated user exists", async () => {
    query.mockResolvedValueOnce([{ id: 1 }]);

    await expect(deleteUserQuery(7)).rejects.toThrow(
      "Can't delete last elevated user.",
    );

    expect(query).toHaveBeenCalledTimes(1);
  });

  it("propagates errors when checking elevated users", async () => {
    query.mockRejectedValue(new Error("Database error"));

    await expect(deleteUserQuery(7)).rejects.toThrow("Database error");

    expect(query).toHaveBeenCalledTimes(1);
  });

  it("propagates errors when soft-deleting the user", async () => {
    query
      .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
      .mockRejectedValueOnce(new Error("Database error"));

    await expect(deleteUserQuery(7)).rejects.toThrow("Database error");
  });
});

