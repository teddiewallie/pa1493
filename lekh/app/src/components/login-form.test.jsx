
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "./login-form";
import { signIn } from "next-auth/react";
import { getLanding } from "@/routes";

const { push } = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("@/routes", () => ({
  getLanding: vi.fn(() => ({ route: "/units" })),
}));

vi.mock("cn", () => ({
  cn: (...classes) => classes.filter(Boolean).join(" "),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }) => <p {...props}>{children}</p>,
  CardFooter: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
}));

vi.mock("@/components/ui/field", () => ({
  Field: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldDescription: ({ children }) => <p>{children}</p>,
  FieldGroup: ({ children }) => <div>{children}</div>,
  FieldLabel: ({ children, ...props }) => <label {...props}>{children}</label>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props) => <input {...props} />,
}));

beforeEach(() => {
  vi.clearAllMocks();
  getLanding.mockReturnValue({ route: "/units" });
});

describe("LoginForm", () => {
  it("renders the login form with required email and password fields", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "Lab Equipment Knowledge Hub" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Password")).toBeRequired();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.queryByText("Invalid email or password.")).not.toBeInTheDocument();
  });

  it("calls signIn with the submitted credentials and navigates on success", async () => {
    signIn.mockResolvedValue({ ok: true, error: null });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "user@example.com",
        password: "secret123",
        redirect: false,
      });
      expect(getLanding).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith("/units");
    });

    expect(screen.queryByText("Invalid email or password.")).not.toBeInTheDocument();
  });

  it("shows an error when credentials are rejected", async () => {
    signIn.mockResolvedValue({ error: "CredentialsSignin" });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
    expect(getLanding).not.toHaveBeenCalled();
  });

  it("navigates when signIn returns a result without an error", async () => {
    signIn.mockResolvedValue({ ok: true });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/units");
    });

    expect(screen.queryByText("Invalid email or password.")).not.toBeInTheDocument();
  });

  it("applies the supplied className and other div props", () => {
    const { container } = render(
      <LoginForm className="custom-class" data-testid="login-wrapper" />
    );

    const wrapper = screen.getByTestId("login-wrapper");
    expect(wrapper).toHaveClass("flex", "flex-col", "gap-6", "custom-class");
    expect(container.firstChild).toBe(wrapper);
  });
});

