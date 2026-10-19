import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { CreateArticleForm } from "./create-article-form";
import { EquipmentContext } from "@/context/equipment-context";
import { saveArticle } from "@/service/save-article";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => async (values) => ({
    values,
    errors: {},
  }),
}));

vi.mock("@/service/save-article", () => ({
  saveArticle: vi.fn(),
}));

vi.mock("@/schema/article-schema", () => ({
  createArticleSchema: () => ({}),
}));

vi.mock("@/components/ui/field", () => ({
  Field: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldSet: ({ children, ...props }) => <fieldset {...props}>{children}</fieldset>,
  FieldError: () => null,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props) => <input {...props} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, children }) => (
    <div>
      <span data-testid="selected-type">{value}</span>
      <button
        type="button"
        onClick={() => onValueChange("2")}
      >
        Choose Documentation
      </button>
      {children}
    </div>
  ),
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children }) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }) => (
    <div {...props}>{children}</div>
  ),
  SelectValue: ({ children }) => <span>{children}</span>,
}));

vi.mock("@/components/markdown-editor", () => ({
  MarkdownEditor: ({ value, onChange }) => (
    <textarea
      aria-label="Article content"
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

const articleTypes = [
  { id: 1, name: "Guide" },
  { id: 2, name: "Documentation" },
];

const items = [
  { id: 10, name: "Arduino", serial: "ARD-001" },
];

const groups = [
  { id: 20, name: "Microcontrollers" },
];

const renderForm = (props = {}) => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onFail: vi.fn(),
    articleTypes,
    typeId: 1,
    userId: 5,
    isStudent: false,
  };

  return render(
    <EquipmentContext.Provider value={{ items, groups }}>
      <CreateArticleForm {...defaultProps} {...props} />
    </EquipmentContext.Provider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CreateArticleForm", () => {
  it("renders the form fields and save button", () => {
    renderForm();

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Article content")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Article" })
    ).toBeInTheDocument();
  });

  it("populates the fields when editing an existing article", () => {
    renderForm({
      typeId: undefined,
      article: {
        id: 42,
        title: "Getting Started",
        content: "Initial article content",
        type_id: 2,
      },
    });

    expect(screen.getByPlaceholderText("Title")).toHaveValue(
      "Getting Started"
    );
    expect(screen.getByLabelText("Article content")).toHaveValue(
      "Initial article content"
    );
    expect(screen.getByTestId("selected-type")).toHaveTextContent("2");
  });

  it("hides the article-type selector for students", () => {
    renderForm({ isStudent: true });

    expect(
      screen.queryByRole("button", { name: "Choose Documentation" })
    ).not.toBeInTheDocument();
  });

  it("allows non-students to change the article type", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.click(
      screen.getByRole("button", { name: "Choose Documentation" })
    );

    expect(screen.getByTestId("selected-type")).toHaveTextContent("2");
  });

  it("submits the form and calls onSuccess when saving succeeds", async () => {
    const user = userEvent.setup();
    const result = { id: 42 };
    const onSuccess = vi.fn();
    const onFail = vi.fn();

    saveArticle.mockResolvedValue(result);

    renderForm({ onSuccess, onFail });

    await user.type(
      screen.getByPlaceholderText("Title"),
      "Getting Started"
    );

    await user.type(
      screen.getByLabelText("Article content"),
      "Some article content"
    );

    await user.click(
      screen.getByRole("button", { name: "Save Article" })
    );

    await waitFor(() => {
      expect(saveArticle).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Getting Started",
          content: "Some article content",
          typeId: 1,
          userId: 5,
        })
      );
    });

    expect(onSuccess).toHaveBeenCalledWith(result);
    expect(onFail).not.toHaveBeenCalled();
  });

  it("calls onFail when saving returns a falsy result", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const onFail = vi.fn();

    saveArticle.mockResolvedValue(false);

    renderForm({ onSuccess, onFail });

    await user.type(
      screen.getByPlaceholderText("Title"),
      "Failed Article"
    );

    await user.click(
      screen.getByRole("button", { name: "Save Article" })
    );

    await waitFor(() => {
      expect(onFail).toHaveBeenCalledOnce();
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("links back to the associated item", () => {
    renderForm({ itemId: 10 });

    expect(
      screen.getByRole("link", { name: /Arduino - ARD-001/ })
    ).toHaveAttribute("href", "/units/by-id/10");
  });

  it("links back to the associated group", () => {
    renderForm({ groupId: 20 });

    expect(
      screen.getByRole("link", { name: "Microcontrollers" })
    ).toHaveAttribute("href", "/units/by-type/20");
  });
});

