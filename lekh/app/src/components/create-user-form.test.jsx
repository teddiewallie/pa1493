
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateUserForm } from "./create-user-form";
import { UserContext } from "@/context/user-context";
import { saveUser } from "@/service/save-user";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/service/save-user", () => ({
  saveUser: vi.fn(),
}));

vi.mock("@/schema/user-schema", () => ({
  createUserSchema: vi.fn(() => ({})),
}));

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => async (values) => ({
    values,
    errors: {},
  }),
}));

vi.mock("@/components/ui/field", () => ({
  Field: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldDescription: ({ children }) => <p>{children}</p>,
  FieldGroup: ({ children }) => <div>{children}</div>,
  FieldLabel: ({ children, ...props }) => <label {...props}>{children}</label>,
  FieldSet: ({ children, ...props }) => <fieldset {...props}>{children}</fieldset>,
  FieldError: ({ errors }) =>
    errors?.[0]?.message ? <p>{errors[0].message}</p> : null,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props) => <input {...props} />,
}));

vi.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({ checked, onCheckedChange, ...props }) => (
    <input
      {...props}
      type="checkbox"
      checked={checked}
      onChange={(event) => onCheckedChange(event.target.checked)}
    />
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

const renderComponent = ({
  loggedInUser = { id: 1, role_id: 1 },
  user,
  canDelete = false,
  onSuccess = vi.fn(),
  onFail = vi.fn(),
  onDelete = vi.fn(),
} = {}) => {
  const result = render(
    <UserContext.Provider value={{ user: loggedInUser }}>
      <CreateUserForm
        title="User"
        onSuccess={onSuccess}
        onFail={onFail}
        onDelete={onDelete}
        user={user}
        canDelete={canDelete}
      />
    </UserContext.Provider>
  );

  return { ...result, onSuccess, onFail, onDelete };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CreateUserForm", () => {
  it("renders the user fields", () => {
    renderComponent();

    expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save User" })).toBeInTheDocument();
  });

  it("starts with empty fields when creating a user", () => {
    renderComponent();

    expect(screen.getByLabelText("E-mail")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveValue("");
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByRole("checkbox", { name: "Set as maintainer" })).not.toBeChecked();
  });

  it("populates fields when editing an existing maintainer", () => {
    renderComponent({
      user: {
        id: 42,
        name: "Ada Lovelace",
        email: "ada@example.com",
        role_id: 1,
      },
    });

    expect(screen.getByLabelText("E-mail")).toHaveValue("ada@example.com");
    expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace");
    expect(screen.getByRole("checkbox", { name: "Set as maintainer" })).toBeChecked();
  });

  it("hides the maintainer checkbox from non-maintainers", () => {
    renderComponent({
      loggedInUser: { id: 2, role_id: 2 },
    });

    expect(
      screen.queryByRole("checkbox", { name: "Set as maintainer" })
    ).not.toBeInTheDocument();
  });

  it("saves user data and calls onSuccess when saving succeeds", async () => {
    saveUser.mockResolvedValue(true);
    const { onSuccess, onFail } = renderComponent();

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "New User" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "pass1234" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Set as maintainer" }));
    fireEvent.click(screen.getByRole("button", { name: "Save User" }));

    await waitFor(() => {
      expect(saveUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New User",
          email: "new@example.com",
          password: "pass1234",
          maintainer: true,
        })
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    expect(onFail).not.toHaveBeenCalled();
  });

  it("calls onFail when saving fails", async () => {
    saveUser.mockResolvedValue(false);
    const { onSuccess, onFail } = renderComponent();

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "New User" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save User" }));

    await waitFor(() => {
      expect(saveUser).toHaveBeenCalled();
      expect(onFail).toHaveBeenCalledTimes(1);
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("shows Delete User only when canDelete is true", () => {
    const { rerender } = renderComponent();

    expect(
      screen.queryByRole("button", { name: "Delete User" })
    ).not.toBeInTheDocument();

    rerender(
      <UserContext.Provider value={{ user: { id: 1, role_id: 1 } }}>
        <CreateUserForm
          title="User"
          onSuccess={vi.fn()}
          onFail={vi.fn()}
          onDelete={vi.fn()}
          canDelete
        />
      </UserContext.Provider>
    );

    expect(screen.getByRole("button", { name: "Delete User" })).toBeInTheDocument();
  });

  it("calls onDelete without submitting the form", async () => {
    const { onDelete } = renderComponent({ canDelete: true });

    fireEvent.click(screen.getByRole("button", { name: "Delete User" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(saveUser).not.toHaveBeenCalled();
  });
});

