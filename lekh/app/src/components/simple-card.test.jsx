import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SimpleCard } from "./simple-card";

describe("SimpleCard", () => {
  it("renders an empty div when no title is provided", () => {
    const { container } = render(
      <SimpleCard description="Description" content="Content" />
    );

    expect(container.firstChild.tagName).toBe("DIV");
    expect(container.firstChild).toBeEmptyDOMElement();
    expect(screen.queryByText("Description")).not.toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders the title, description, and content", () => {
    render(
      <SimpleCard
        title="Equipment"
        description="Equipment details"
        content={<p>Oscilloscope information</p>}
      />
    );

    expect(screen.getByText("Equipment")).toBeInTheDocument();
    expect(screen.getByText("Equipment details")).toBeInTheDocument();
    expect(screen.getByText("Oscilloscope information")).toBeInTheDocument();
  });

  it("applies the expected card and content classes", () => {
    const { container } = render(
      <SimpleCard
        title="Equipment"
        description="Details"
        content="Content"
      />
    );

    expect(container.firstChild).toHaveClass("print:hidden");

    const content = container.querySelector(".whitespace-pre-line");

    expect(content).not.toBeNull();
    expect(content).toHaveClass("overflow-scroll");
  });

  it("applies maxHeight when provided", () => {
    const { container } = render(
      <SimpleCard
        title="Equipment"
        description="Details"
        maxHeight={350}
        content="Content"
      />
    );

    expect(container.querySelector(".whitespace-pre-line"))
      .toHaveStyle({ maxHeight: "350px" });
  });

  it("does not set maxHeight when omitted", () => {
    render(
      <SimpleCard
        title="Equipment"
        description="Details"
        content="Content"
      />
    );

    expect(screen.getByText("Content").parentElement.style.maxHeight)
      .toBe("");
  });

  it("renders multiline text with the whitespace-preserving class", () => {
    render(
      <SimpleCard
        title="Notes"
        description="Notes for this unit"
        content={"First line\nSecond line"}
      />
    );

    expect(screen.getByText(/First line/)).toHaveClass(
      "whitespace-pre-line"
    );
  });
});

