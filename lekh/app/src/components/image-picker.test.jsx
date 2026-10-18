
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { ImagePicker } from "./image-picker";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe("ImagePicker", () => {
  let createObjectURL;

  beforeEach(() => {
    createObjectURL = vi.fn(() => "blob:test-image-url");
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the select button and an image-only file input", () => {
    render(<ImagePicker onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Select Image" })).toBeInTheDocument();

    const input = document.querySelector('input[type="file"]');
    expect(input).toHaveAttribute("accept", "image/*");
  });

  it("shows the current image when provided", () => {
    render(<ImagePicker onChange={vi.fn()} current="/api/asset/123" />);

    expect(screen.getByRole("img", { name: "Preview" })).toHaveAttribute(
      "src",
      "/api/asset/123"
    );
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it("does not render a preview when there is no current image or selected file", () => {
    render(<ImagePicker onChange={vi.fn()} />);

    expect(screen.queryByRole("img", { name: "Preview" })).not.toBeInTheDocument();
  });

  it("calls onChange with the selected file and displays its preview", () => {
    const onChange = vi.fn();
    render(<ImagePicker onChange={onChange} />);

    const file = new File(["image data"], "photo.png", { type: "image/png" });
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [file] },
    });

    expect(onChange).toHaveBeenCalledWith(file);
    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByRole("img", { name: "Preview" })).toHaveAttribute(
      "src",
      "blob:test-image-url"
    );
  });

  it("replaces the current image preview after selecting a new file", () => {
    const onChange = vi.fn();
    render(<ImagePicker onChange={onChange} current="/api/asset/123" />);

    const file = new File(["new image"], "new-photo.jpg", {
      type: "image/jpeg",
    });
    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [file] },
    });

    expect(screen.getByRole("img", { name: "Preview" })).toHaveAttribute(
      "src",
      "blob:test-image-url"
    );
    expect(screen.getByRole("img", { name: "Preview" })).not.toHaveAttribute(
      "src",
      "/api/asset/123"
    );
  });

  it("does nothing when the file selection is empty", () => {
    const onChange = vi.fn();
    render(<ImagePicker onChange={onChange} current="/api/asset/123" />);

    fireEvent.change(document.querySelector('input[type="file"]'), {
      target: { files: [] },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("img", { name: "Preview" })).toHaveAttribute(
      "src",
      "/api/asset/123"
    );
  });
});

