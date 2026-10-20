// src/components/modal-with-toast.test.jsx

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ModalWithToast } from "@/components/modal-with-toast";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/dialog", async () => {
  const React = await import("react");

  return {
    Dialog: ({ open, onOpenChange, children }) => (
      <div data-testid="dialog" data-open={String(open)}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { onOpenChange })
            : child
        )}
      </div>
    ),

    DialogTrigger: ({ render, onOpenChange }) =>
      React.cloneElement(render, {
        onClick: () => onOpenChange?.(true),
      }),

    DialogContent: ({ children, className }) => (
      <div data-testid="dialog-content" data-class-name={className}>
        {children}
      </div>
    ),

    DialogHeader: ({ children }) => <div>{children}</div>,

    DialogTitle: ({ children }) => <h2>{children}</h2>,
  };
});

describe("ModalWithToast", () => {
  it("renders the trigger with the provided title", () => {
    render(
      <ModalWithToast title="Test modal">
        <div>Modal content</div>
      </ModalWithToast>
    );

    expect(
      screen.getByRole("button", { name: "Test modal" })
    ).toBeInTheDocument();
  });

  it("starts with the modal closed", () => {
    render(
      <ModalWithToast title="Test modal">
        <div>Modal content</div>
      </ModalWithToast>
    );

    expect(screen.getByTestId("dialog")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  it("opens the modal when the trigger is clicked", () => {
    render(
      <ModalWithToast title="Test modal">
        <div>Modal content</div>
      </ModalWithToast>
    );

    fireEvent.click(screen.getByRole("button", { name: "Test modal" }));

    expect(screen.getByTestId("dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("renders the provided title inside the dialog", () => {
    render(
      <ModalWithToast title="Add Unit">
        <div>Modal content</div>
      </ModalWithToast>
    );

    expect(screen.getByRole("heading", { name: "Add Unit" })).toBeInTheDocument();
  });

  it("applies the standard content classes when doubleWidth is false", () => {
    render(
      <ModalWithToast title="Test modal">
        <div>Modal content</div>
      </ModalWithToast>
    );

    expect(screen.getByTestId("dialog-content")).toHaveAttribute(
      "data-class-name",
      "max-h-[calc(100vh-2rem)] flex-col overflow-y-scroll"
    );
  });

  it("applies the wider content classes when doubleWidth is true", () => {
    render(
      <ModalWithToast title="Test modal" doubleWidth>
        <div>Modal content</div>
      </ModalWithToast>
    );

    expect(screen.getByTestId("dialog-content")).toHaveAttribute(
      "data-class-name",
      "sm:max-w-[95vw] lg:max-w-[960px] max-h-[calc(100vh-2rem)] flex-col overflow-y-scroll"
    );
  });

  it.each([
    "onSuccess",
    "onFail",
    "onDelete",
    "onDeleteSuccess",
    "onDeleteFail",
  ])("calls the child %s callback and closes the modal", (callbackName) => {
    const callback = vi.fn();

    // This component calls the callback it receives through its props.
    // ModalWithToast replaces that callback with a wrapper that closes the modal.
    const TestChild = (props) => (
      <button
        type="button"
        onClick={() => props[callbackName]("test argument")}
      >
        Trigger callback
      </button>
    );

    render(
      <ModalWithToast title="Test modal">
        <TestChild {...{ [callbackName]: callback }} />
      </ModalWithToast>
    );

    fireEvent.click(screen.getByRole("button", { name: "Test modal" }));

    expect(screen.getByTestId("dialog")).toHaveAttribute(
      "data-open",
      "true"
    );

    fireEvent.click(screen.getByRole("button", { name: "Trigger callback" }));

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith("test argument");
    expect(screen.getByTestId("dialog")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  it("does not close the modal when no callback is invoked", () => {
    render(
      <ModalWithToast title="Test modal">
        <button type="button">Do nothing</button>
      </ModalWithToast>
    );

    fireEvent.click(screen.getByRole("button", { name: "Test modal" }));
    fireEvent.click(screen.getByRole("button", { name: "Do nothing" }));

    expect(screen.getByTestId("dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
  });

  it("renders children without callback props", () => {
    render(
      <ModalWithToast title="Test modal">
        <p>Content without callbacks</p>
      </ModalWithToast>
    );

    expect(screen.getByText("Content without callbacks")).toBeInTheDocument();
  });
});
