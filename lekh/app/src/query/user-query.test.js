// src/query/user-query.test.js

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

import pool from "@/lib/db";
import bcrypt from "bcrypt";
import {
  getAllUsersQuery,
  getUsersByEmailQuery,
  getUsersByIdQuery,
  addUserQuery,
  updateUserQuery,
  deleteUserQuery,
} from "./user-query";

describe("user-query", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUsersByEmailQuery", () => {
    it("queries for a non-deleted user by email", async () => {
      const users = [{ id: 1, email: "user@example.com" }];
      pool.query.mockResolvedValueOnce(users);

      await expect(
        getUsersByEmailQuery("user@example.com")
      ).resolves.toEqual(users);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT id, name, email, password, role_id FROM user WHERE email=? AND deleted=FALSE",
        ["user@example.com"]
      );
    });
  });

  describe("getUsersByIdQuery", () => {
    it("queries for a non-deleted user by ID", async () => {
      const users = [{ id: 7, name: "Test User" }];
      pool.query.mockResolvedValueOnce(users);

      await expect(getUsersByIdQuery(7)).resolves.toEqual(users);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT id, name, email, role_id FROM user WHERE id=? AND deleted=FALSE",
        [7]
      );
    });
  });

  describe("getAllUsersQuery", () => {
    it("returns non-deleted users without their passwords", async () => {
      const users = [
        { id: 1, name: "Admin", role_id: 1 },
        { id: 2, name: "Student", role_id: 2 },
      ];
      pool.query.mockResolvedValueOnce(users);

      await expect(getAllUsersQuery()).resolves.toEqual(users);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT id, name, email, deleted, role_id FROM user WHERE deleted=FALSE"
      );
    });
  });

  describe("addUserQuery", () => {
    it("hashes the password and inserts a regular user", async () => {
      bcrypt.hash.mockResolvedValueOnce("hashed-password");
      pool.query.mockResolvedValueOnce({ insertId: 10 });

      await addUserQuery({
        name: "Test User",
        email: "user@example.com",
        password: "secret123",
        maintainer: false,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("secret123", 12);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO user (name, email, password, role_id) VALUES (?, ?, ?, ?)",
        ["Test User", "user@example.com", "hashed-password", 2]
      );
    });

    it("assigns role 1 to a maintainer", async () => {
      bcrypt.hash.mockResolvedValueOnce("hashed-password");
      pool.query.mockResolvedValueOnce({ insertId: 11 });

      await addUserQuery({
        name: "Maintainer",
        email: "maintainer@example.com",
        password: "secret456",
        maintainer: true,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("secret456", 12);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO user (name, email, password, role_id) VALUES (?, ?, ?, ?)",
        ["Maintainer", "maintainer@example.com", "hashed-password", 1]
      );
    });
  });

  describe("updateUserQuery", () => {
    const userData = {
      id: 7,
      name: "Updated User",
      email: "updated@example.com",
      maintainer: false,
      password: "",
    };

    it("updates name and email without changing the password", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 7, role_id: 2 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await expect(updateUserQuery(userData, false)).resolves.toBe(true);

      expect(bcrypt.hash).not.toHaveBeenCalled();

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT id, role_id FROM user WHERE id=? AND deleted=FALSE",
        [7]
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "UPDATE user SET name=?, email=?, role_id=? WHERE id=?",
        ["Updated User", "updated@example.com", 2, 7]
      );
    });

    it("promotes a user to maintainer when an admin requests it", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 7, role_id: 2 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await updateUserQuery(
        { ...userData, maintainer: true },
        true
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "UPDATE user SET name=?, email=?, role_id=? WHERE id=?",
        ["Updated User", "updated@example.com", 1, 7]
      );
    });

    it("does not promote a user when the requester is not an admin", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 7, role_id: 2 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await updateUserQuery(
        { ...userData, maintainer: true },
        false
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "UPDATE user SET name=?, email=?, role_id=? WHERE id=?",
        ["Updated User", "updated@example.com", 2, 7]
      );
    });

    it("allows demotion when more than one maintainer exists", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 7, role_id: 1 }])
        .mockResolvedValueOnce([{ id: 1 }, { id: 7 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await updateUserQuery(userData, false);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT id, role_id FROM user WHERE id=? AND deleted=FALSE",
        [7]
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "SELECT id FROM user WHERE role_id=1 AND deleted=0"
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        3,
        "UPDATE user SET name=?, email=?, role_id=? WHERE id=?",
        ["Updated User", "updated@example.com", 2, 7]
      );
    });

    it("prevents demotion when only one maintainer exists", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 7, role_id: 1 }])
        .mockResolvedValueOnce([{ id: 7 }]);

      await expect(
        updateUserQuery(userData, false)
      ).rejects.toThrow("Can't demote last elevated user.");

      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it("hashes and updates a new password", async () => {
      bcrypt.hash.mockResolvedValueOnce("new-hashed-password");

      pool.query
        .mockResolvedValueOnce([{ id: 7, role_id: 2 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await updateUserQuery(
        { ...userData, password: "new-secret" },
        false
      );

      expect(bcrypt.hash).toHaveBeenCalledWith("new-secret", 12);

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "UPDATE user SET name=?, email=?, password=?, role_id=? WHERE id=?",
        [
          "Updated User",
          "updated@example.com",
          "new-hashed-password",
          2,
          7,
        ]
      );
    });

    it("does not hash an empty password", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 7, role_id: 2 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await updateUserQuery(
        { ...userData, password: "" },
        false
      );

      expect(bcrypt.hash).not.toHaveBeenCalled();

      const [sql] = pool.query.mock.calls[1];
      expect(sql).not.toContain("password=?");
    });

    it("throws when the user to update does not exist", async () => {
      pool.query.mockResolvedValueOnce([]);

      await expect(
        updateUserQuery(userData, false)
      ).rejects.toThrow("User not found.");

      expect(pool.query).toHaveBeenCalledOnce();
    });
  });

  describe("deleteUserQuery", () => {
    it("soft-deletes a user when multiple maintainers exist", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
        .mockResolvedValueOnce([{ id: 7 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await deleteUserQuery(7);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT id FROM user WHERE role_id=1 AND deleted=0"
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "SELECT id FROM user WHERE id=? AND deleted=FALSE",
        [7]
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        3,
        "UPDATE user SET deleted=? WHERE id=?",
        [1, 7]
      );
    });

    it("throws when attempting to delete the last maintainer", async () => {
      pool.query.mockResolvedValueOnce([{ id: 1 }]);

      await expect(deleteUserQuery(1)).rejects.toThrow(
        "Can't delete last elevated user."
      );

      expect(pool.query).toHaveBeenCalledOnce();
    });

    it("allows deletion when there are no maintainers", async () => {
      pool.query
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ id: 7 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await deleteUserQuery(7);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT id FROM user WHERE role_id=1 AND deleted=0"
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "SELECT id FROM user WHERE id=? AND deleted=FALSE",
        [7]
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        3,
        "UPDATE user SET deleted=? WHERE id=?",
        [1, 7]
      );
    });

    it("throws when the user to delete does not exist", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
        .mockResolvedValueOnce([]);

      await expect(deleteUserQuery(7)).rejects.toThrow("User not found.");

      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it("does not prevent deleting a regular user when only one maintainer exists", async () => {
      pool.query
        .mockResolvedValueOnce([{ id: 1 }])
        .mockResolvedValueOnce([{ id: 7 }])
        .mockResolvedValueOnce({ affectedRows: 1 });

      await deleteUserQuery(7);

      expect(pool.query).toHaveBeenNthCalledWith(
        3,
        "UPDATE user SET deleted=? WHERE id=?",
        [1, 7]
      );
    });
  });
});
