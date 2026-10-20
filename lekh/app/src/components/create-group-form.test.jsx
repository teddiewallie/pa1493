import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateGroupForm } from "./create-group-form";

import { saveGroup } from "@/service/save-group";
import { deleteGroup } from "@/service/delete-group";

vi.mock("@/service/save-group", () => ({
  saveGroup: vi.fn(),
}));

vi.mock("@/service/delete-group", () => ({
  deleteGroup: vi.fn(),
}));

describe("CreateGroupForm", () => {
  const onSuccess = vi.fn();
  const onFail = vi.fn();
  const onDeleteSuccess = vi.fn();
  const onDeleteFail = vi.fn();

  const defaultProps = {
    onSuccess,
    onFail,
    onDeleteSuccess,
    onDeleteFail,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    saveGroup.mockResolvedValue(true);
    deleteGroup.mockResolvedValue(true);
  });

  it("renders the form fields and save button", () => {
    render(<CreateGroupForm {...defaultProps} />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Known Issues")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Type" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Delete Type" })
    ).not.toBeInTheDocument();
  });

  it("populates fields when editing an existing group", () => {
    render(
      <CreateGroupForm
        {...defaultProps}
        group={{
          id: 2,
          name: "Raspberry Pi 4 Model B",
          description: "Development boards",
          known_issues: "Some USB issues",
        }}
      />
    );

    expect(screen.getByLabelText("Name")).toHaveValue(
      "Raspberry Pi 4 Model B"
    );
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Development boards"
    );
    expect(screen.getByLabelText("Known Issues")).toHaveValue(
      "Some USB issues"
    );

    expect(
      screen.getByRole("button", { name: "Delete Type" })
    ).toBeInTheDocument();
  });

  it("uses groupId as the form ID when no group is supplied", async () => {
    const user = userEvent.setup();

    render(
      <CreateGroupForm {...defaultProps} groupId={7} />
    );

    await user.type(screen.getByLabelText("Name"), "ESP32");
    await user.type(
      screen.getByLabelText("Description"),
      "Development boards"
    );

    await user.click(
      screen.getByRole("button", { name: "Save Type" })
    );

    await waitFor(() => {
      expect(saveGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 7,
          name: "ESP32",
          description: "Development boards",
          knownIssues: "",
        })
      );
    });
  });

  it("calls onSuccess when saving succeeds", async () => {
    const user = userEvent.setup();

    render(
      <CreateGroupForm {...defaultProps} groupId={3} />
    );

    await user.type(screen.getByLabelText("Name"), "Arduino");
    await user.type(
      screen.getByLabelText("Description"),
      "Arduino boards"
    );

    await user.click(
      screen.getByRole("button", { name: "Save Type" })
    );

    await waitFor(() => {
      expect(saveGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 3,
          name: "Arduino",
          description: "Arduino boards",
        })
      );
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    expect(onFail).not.toHaveBeenCalled();
  });

  it("calls onFail when saving fails", async () => {
    saveGroup.mockResolvedValue(false);

    const user = userEvent.setup();

    render(<CreateGroupForm {...defaultProps} />);

    await user.type(screen.getByLabelText("Name"), "Arduino");
    await user.type(
      screen.getByLabelText("Description"),
      "Arduino boards"
    );

    await user.click(
      screen.getByRole("button", { name: "Save Type" })
    );

    await waitFor(() => {
      expect(onFail).toHaveBeenCalledOnce();
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("calls onDeleteSuccess when deleting a group succeeds", async () => {
    const user = userEvent.setup();

    render(
      <CreateGroupForm
        {...defaultProps}
        group={{
          id: 2,
          name: "Raspberry Pi",
          description: "Boards",
          known_issues: "",
        }}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Delete Type" })
    );

    await waitFor(() => {
      expect(deleteGroup).toHaveBeenCalledWith(2);
      expect(onDeleteSuccess).toHaveBeenCalledOnce();
    });

    expect(onDeleteFail).not.toHaveBeenCalled();
  });

  it("calls onDeleteFail when deleting a group fails", async () => {
    deleteGroup.mockResolvedValue(false);

    const user = userEvent.setup();

    render(
      <CreateGroupForm
        {...defaultProps}
        group={{
          id: 2,
          name: "Raspberry Pi",
          description: "Boards",
          known_issues: "",
        }}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Delete Type" })
    );

    await waitFor(() => {
      expect(deleteGroup).toHaveBeenCalledWith(2);
      expect(onDeleteFail).toHaveBeenCalledOnce();
    });

    expect(onDeleteSuccess).not.toHaveBeenCalled();
  });

  it("does not show the delete button for group ID 1", () => {
    render(
      <CreateGroupForm
        {...defaultProps}
        group={{
          id: 1,
          name: "Ungrouped",
          description: "",
          known_issues: "",
        }}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Delete Type" })
    ).not.toBeInTheDocument();
  });
});

