import { render, screen, fireEvent, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MarkdownEditor } from "./markdown-editor";

vi.mock("@uiw/react-md-editor", () => ({
  default: ({
    value,
    onChange,
    hideToolbar,
    visibleDragbar,
    preview,
    height,
    style,
  }) => (
    <textarea
      aria-label="Markdown editor"
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
      data-preview={preview}
      data-hide-toolbar={String(hideToolbar)}
      data-visible-dragbar={String(visibleDragbar)}
      data-height={height}
      style={style}
    />
  ),
}));

let mediaQuery;
let changeHandler;

beforeEach(() => {
  changeHandler = undefined;

  mediaQuery = {
    matches: false,
    addEventListener: vi.fn((event, handler) => {
      if (event === "change") changeHandler = handler;
    }),
    removeEventListener: vi.fn(),
  };

  window.matchMedia = vi.fn(() => mediaQuery);
});

describe("MarkdownEditor", () => {
  it("renders with the expected editor configuration on a large screen", () => {
    const onChange = vi.fn();

    render(<MarkdownEditor value="# Hello" onChange={onChange} />);

    const editor = screen.getByRole("textbox", { name: "Markdown editor" });

    expect(editor).toHaveValue("# Hello");
    expect(editor).toHaveAttribute("data-preview", "live");
    expect(editor).toHaveAttribute("data-hide-toolbar", "true");
    expect(editor).toHaveAttribute("data-visible-dragbar", "false");
    expect(editor).toHaveAttribute("data-height", "100%");
    expect(editor.style.getPropertyValue("--md-editor-background-color"))
      .toBe("hsl(var(--background))");

    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 1023px)");
    expect(mediaQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("uses edit-only preview on a small screen", () => {
    mediaQuery.matches = true;

    render(<MarkdownEditor value="Small screen" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox", { name: "Markdown editor" }))
      .toHaveAttribute("data-preview", "edit");
  });

  it("updates the preview when the screen crosses the breakpoint", () => {
    render(<MarkdownEditor value="Responsive" onChange={vi.fn()} />);

    const editor = screen.getByRole("textbox", { name: "Markdown editor" });

    expect(editor).toHaveAttribute("data-preview", "live");

    mediaQuery.matches = true;

    act(() => {
      changeHandler();
    });

    expect(editor).toHaveAttribute("data-preview", "edit");

    mediaQuery.matches = false;

    act(() => {
      changeHandler();
    });

    expect(editor).toHaveAttribute("data-preview", "live");
  });

  it("forwards value changes through onChange", () => {
    const onChange = vi.fn();

    render(<MarkdownEditor value="Initial" onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Markdown editor" }), {
      target: { value: "Updated markdown" },
    });

    expect(onChange).toHaveBeenCalledWith("Updated markdown");
  });

  it("removes the media-query listener on unmount", () => {
    const { unmount } = render(
      <MarkdownEditor value="" onChange={vi.fn()} />
    );

    const registeredHandler = mediaQuery.addEventListener.mock.calls[0][1];

    unmount();

    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      registeredHandler
    );
  });
});

