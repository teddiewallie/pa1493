import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, getAllUsersQuery } = vi.hoisted(() => ({
  auth: vi.fn(),
  getAllUsersQuery: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth }));
vi.mock("@/query/user-query", () => ({ getAllUsersQuery }));

import { getUsers } from "./get-users";

describe("getUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.mockResolvedValue({ user: { role_id: 1 } });
    getAllUsersQuery.mockResolvedValue([
      { id: 1, name: "Maintainer" },
      { id: 2, name: "Student" },
    ]);
  });

  it("returns all users for a maintainer", async () => {
    await expect(getUsers()).resolves.toEqual([
      { id: 1, name: "Maintainer" },
      { id: 2, name: "Student" },
    ]);

    expect(getAllUsersQuery).toHaveBeenCalledOnce();
  });

  it("returns an empty array when there is no session", async () => {
    auth.mockResolvedValue(null);

    await expect(getUsers()).resolves.toEqual([]);
    expect(getAllUsersQuery).not.toHaveBeenCalled();
  });

  it("returns an empty array when the user has no role ID", async () => {
    auth.mockResolvedValue({ user: {} });

    await expect(getUsers()).resolves.toEqual([]);
    expect(getAllUsersQuery).not.toHaveBeenCalled();
  });

  it.each([2, 3, 0, -1])(
    "returns an empty array for role ID %s",
    async (role_id) => {
      auth.mockResolvedValue({ user: { role_id } });

      await expect(getUsers()).resolves.toEqual([]);
      expect(getAllUsersQuery).not.toHaveBeenCalled();
    }
  );

  it("returns an empty array when fetching users fails", async () => {
    const error = new Error("Database error");
    getAllUsersQuery.mockRejectedValue(error);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await expect(getUsers()).resolves.toEqual([]);

    expect(log).toHaveBeenCalledWith(error);
    log.mockRestore();
  });

  it("returns an empty array when there are no users", async () => {
    getAllUsersQuery.mockResolvedValue([]);

    await expect(getUsers()).resolves.toEqual([]);
  });
});

