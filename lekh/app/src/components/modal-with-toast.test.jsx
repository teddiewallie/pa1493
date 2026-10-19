import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ModalWithToast } from "./modal-with-toast";
import { toast } from "@/components/ui/toast";

vi.mock("@/components/ui/toast", () => ({
  toast: {
    add: vi.fn(),
  },
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/create-user-form", () => ({
  CreateUserForm: () => <div />,
}));

vi.mock("@/components/ui/dialog", async () => {
  const React = await import("react");
  const DialogContext = React.createContext(null);

  return {
    Dialog: ({ open, onOpenChange, children }) => (
      <DialogContext.Provider value={{ open, onOpenChange }}>
        {children}
      </DialogContext.Provider>
    ),

    DialogTrigger: ({ render }) => {
      const { onOpenChange } = React.useContext(DialogContext);

      return React.cloneElement(render, {
        onClick: (event) => {
          render.props.onClick?.(event);
          onOpenChange(true);
        },
      });
    },

    DialogContent: ({ children, className, ...props }) => {
      const { open } = React.useContext(DialogContext);

      return open ? (
        <div role="dialog" className={className} {...props}>
          {children}
        </div>
      ) : null;
    },

    DialogClose: ({ children }) => children,
    DialogDescription: ({ children }) => <p>{children}</p>,
    DialogFooter: ({ children }) => <footer>{children}</footer>,
    DialogHeader: ({ children }) => <header>{children}</header>,
    DialogTitle: ({ children }) => <h2>{children}</h2>,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ModalWithToast", () => {
  it("renders the trigger and opens the dialog when clicked", () => {
    render(
      <ModalWithToast title="Create user" message="" onMessageHandled={vi.fn()}>
        <p>Modal contents</p>
      </ModalWithToast>
    );

    expect(
      screen.queryByRole("dialog")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Create user" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Create user" }))
      .toBeInTheDocument();
    expect(screen.getByText("Modal contents")).toBeInTheDocument();
  });

  it("displays a toast and handles a non-empty message", async () => {
    const onMessageHandled = vi.fn();

    render(
      <ModalWithToast
        title="Create user"
        message="User created"
        onMessageHandled={onMessageHandled}
      />
    );

    await waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith({ title: "User created" });
      expect(onMessageHandled).toHaveBeenCalledTimes(1);
    });
  });

  it("does not display a toast for an empty message", () => {
    const onMessageHandled = vi.fn();

    render(
      <ModalWithToast
        title="Create user"
        message=""
        onMessageHandled={onMessageHandled}
      />
    );

    expect(toast.add).not.toHaveBeenCalled();
    expect(onMessageHandled).not.toHaveBeenCalled();
  });

  it("handles a new message when the message prop changes", async () => {
    const onMessageHandled = vi.fn();

    const { rerender } = render(
      <ModalWithToast
        title="Create user"
        message=""
        onMessageHandled={onMessageHandled}
      />
    );

    rerender(
      <ModalWithToast
        title="Create user"
        message="User created"
        onMessageHandled={onMessageHandled}
      />
    );

    await waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith({ title: "User created" });
      expect(onMessageHandled).toHaveBeenCalledTimes(1);
    });
  });

  it("applies the wider dialog classes when doubleWidth is true", () => {
    render(
      <ModalWithToast
        title="Create user"
        message=""
        onMessageHandled={vi.fn()}
        doubleWidth
      >
        <p>Contents</p>
      </ModalWithToast>
    );

    fireEvent.click(screen.getByRole("button", { name: "Create user" }));

    expect(screen.getByRole("dialog")).toHaveClass(
      "sm:max-w-[95vw]",
      "lg:max-w-[960px]",
      "max-h-[calc(100vh-2rem)]",
      "flex-col",
      "overflow-y-scroll"
    );
  });

  it("does not apply the wider dialog classes when doubleWidth is false", () => {
    render(
      <ModalWithToast
        title="Create user"
        message=""
        onMessageHandled={vi.fn()}
        doubleWidth={false}
      >
        <p>Contents</p>
      </ModalWithToast>
    );

    fireEvent.click(screen.getByRole("button", { name: "Create user" }));

    const dialog = screen.getByRole("dialog");

    expect(dialog).not.toHaveClass("sm:max-w-[95vw]");
    expect(dialog).not.toHaveClass("lg:max-w-[960px]");
    expect(dialog).toHaveClass(
      "max-h-[calc(100vh-2rem)]",
      "flex-col",
      "overflow-y-scroll"
    );
  });
});

