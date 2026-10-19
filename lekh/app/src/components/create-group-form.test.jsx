
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateGroupForm } from "./create-group-form";
import { saveGroup } from "@/service/save-group";
import { deleteGroup } from "@/service/delete-group";

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => async (values) => ({ values, errors: {} }),
}));

vi.mock("@/schema/group-schema", () => ({
  createGroupSchema: () => ({}),
}));

vi.mock("@/service/save-group", () => ({
  saveGroup: vi.fn(),
}));

vi.mock("@/service/delete-group", () => ({
  deleteGroup: vi.fn(),
}));

vi.mock("@/components/ui/field", () => ({
  Field: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldLabel: ({ children, ...props }) => <label {...props}>{children}</label>,
  FieldSet: ({ children, ...props }) => <fieldset {...props}>{children}</fieldset>,
  FieldError: () => null,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props) => <input {...props} />,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props) => <textarea {...props} />,
}));

const renderForm = (props = {}) => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onFail: vi.fn(),
    onDeleteSuccess: vi.fn(),
    onDeleteFail: vi.fn(),
  };

  return render(<CreateGroupForm {...defaultProps} {...props} />);
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("CreateGroupForm", () => {
  it("renders the fields and action buttons", () => {
    renderForm();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Known Issues")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Type" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Type" })).toBeInTheDocument();
  });

  it("populates fields when editing an existing group", () => {
    renderForm({
      group: {
        id: 12,
        name: "Raspberry Pi",
        description: "Development boards",
        known_issues: "Some USB ports are unreliable",
      },
    });

    expect(screen.getByLabelText("Name")).toHaveValue("Raspberry Pi");
    expect(screen.getByLabelText("Description")).toHaveValue("Development boards");
    expect(screen.getByLabelText("Known Issues")).toHaveValue(
      "Some USB ports are unreliable"
    );
  });

  it("uses groupId when creating a group", async () => {
    saveGroup.mockResolvedValue(true);
    const onSuccess = vi.fn();

    renderForm({ groupId: 23, onSuccess });

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Sensors" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Type" }));

    await waitFor(() => {
      expect(saveGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 23,
          name: "Sensors",
        })
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("calls onSuccess when saving succeeds", async () => {
    saveGroup.mockResolvedValue({ id: 12 });
    const onSuccess = vi.fn();
    const onFail = vi.fn();

    renderForm({
      group: {
        id: 12,
        name: "Raspberry Pi",
        description: "Development boards",
        known_issues: "None",
      },
      onSuccess,
      onFail,
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Type" }));

    await waitFor(() => {
      expect(saveGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 12,
          name: "Raspberry Pi",
          description: "Development boards",
          knownIssues: "None",
        })
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onFail).not.toHaveBeenCalled();
    });
  });

  it("calls onFail when saving returns a falsy result", async () => {
    saveGroup.mockResolvedValue(null);
    const onSuccess = vi.fn();
    const onFail = vi.fn();

    renderForm({ onSuccess, onFail });

    fireEvent.click(screen.getByRole("button", { name: "Save Type" }));

    await waitFor(() => {
      expect(onFail).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  it("calls onDeleteSuccess when deletion succeeds without submitting the form", async () => {
    deleteGroup.mockResolvedValue(true);
    const onDeleteSuccess = vi.fn();

    renderForm({
      group: { id: 12, name: "Raspberry Pi" },
      onDeleteSuccess,
    });

    fireEvent.click(screen.getByRole("button", { name: "Delete Type" }));

    await waitFor(() => {
      expect(deleteGroup).toHaveBeenCalledWith(12);
      expect(onDeleteSuccess).toHaveBeenCalledTimes(1);
    });

    // Deleting should not also trigger the save handler.
    expect(saveGroup).not.toHaveBeenCalled();
  });

  it("calls onDeleteFail when deletion returns a falsy result", async () => {
    deleteGroup.mockResolvedValue(false);
    const onDeleteFail = vi.fn();

    renderForm({
      group: { id: 12, name: "Raspberry Pi" },
      onDeleteFail,
    });

    fireEvent.click(screen.getByRole("button", { name: "Delete Type" }));

    await waitFor(() => {
      expect(deleteGroup).toHaveBeenCalledWith(12);
      expect(onDeleteFail).toHaveBeenCalledTimes(1);
    });
  });
});

