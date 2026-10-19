
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./page";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ArticleContext } from "@/context/article-context";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  redirect: vi.fn(),
  refreshGroups: vi.fn(),
  refreshItems: vi.fn(),
  refreshArticles: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    use: (value) => value,
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.push,
    replace: mocks.replace,
  }),
  redirect: mocks.redirect,
}));

vi.mock("next/link", () => ({
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));

vi.mock("lucide-react", () => ({
  CircleArrowLeft: () => <span data-testid="back-icon" />,
}));

vi.mock("@/components/item-list", () => ({
  ItemList: ({ children, extraCards, groupId }) => (
    <div data-testid="item-list" data-group-id={groupId}>
      {children}
      {extraCards}
    </div>
  ),
}));

vi.mock("@/components/modal-with-toast", () => ({
  ModalWithToast: ({ children, title, message }) => (
    <div>
      <h2>{title}</h2>
      <p data-testid="toast-message">{message}</p>
      {children}
    </div>
  ),
}));

vi.mock("@/components/create-group-form", () => ({
  CreateGroupForm: ({
    group,
    onSuccess,
    onFail,
    onDeleteSuccess,
    onDeleteFail,
  }) => (
    <div data-testid="create-group-form" data-group-name={group?.name}>
      <button onClick={onSuccess}>Update success</button>
      <button onClick={onFail}>Update failure</button>
      <button onClick={onDeleteSuccess}>Delete success</button>
      <button onClick={onDeleteFail}>Delete failure</button>
    </div>
  ),
}));

vi.mock("@/components/simple-card", () => ({
  SimpleCard: ({ title, description, content }) => (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{content}</p>
    </section>
  ),
}));

vi.mock("@/components/link-button", () => ({
  LinkButton: ({ href, children }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/article-list", () => ({
  ArticleList: ({ articles, articleTypes }) => (
    <div data-testid="article-list">
      {articles.map((article) => (
        <p key={article.id}>{article.title}</p>
      ))}
      <span data-testid="article-types">{articleTypes.length}</span>
    </div>
  ),
}));

const groups = [
  { id: 1, name: "Ungrouped", known_issues: "" },
  { id: 2, name: "Raspberry Pi", known_issues: "Power supply issues" },
  { id: 3, name: "Arduino", known_issues: "" },
];

const articles = [
  { id: 10, group_id: 2, title: "Pi guide" },
  { id: 11, group_id: 3, title: "Arduino guide" },
];

const articleTypes = [{ id: 1, name: "Guide" }];

const renderPage = ({ id = "2", role_id = 2, articleData = articles } = {}) =>
  render(
    <UserContext.Provider value={{ user: { role_id } }}>
      <EquipmentContext.Provider
        value={{
          groups,
          refreshGroups: mocks.refreshGroups,
          refreshItems: mocks.refreshItems,
        }}
      >
        <ArticleContext.Provider
          value={{
            articles: articleData,
            articleTypes,
            refreshArticles: mocks.refreshArticles,
          }}
        >
          <Page params={{ id }} />
        </ArticleContext.Provider>
      </EquipmentContext.Provider>
    </UserContext.Provider>
  );

describe("Units by type page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the group name and item list", () => {
    renderPage();

    expect(
      screen.getByRole("link", { name: "Raspberry Pi" }),
    ).toHaveAttribute("href", "/types");

    expect(screen.getByTestId("item-list")).toHaveAttribute(
      "data-group-id",
      "2",
    );
  });

  it("renders Add Article for a regular group", () => {
    renderPage();

    expect(screen.getByRole("link", { name: "Add Article" })).toHaveAttribute(
      "href",
      "/editor/for-type/2",
    );
  });

  it("does not render Add Article for the ungrouped group", () => {
    renderPage({ id: "1" });

    expect(
      screen.queryByRole("link", { name: "Add Article" }),
    ).not.toBeInTheDocument();
  });

  it("renders the edit form for maintainers", () => {
    renderPage({ role_id: 1 });

    expect(
      screen.getByRole("heading", { name: "Edit Type" }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("create-group-form")).toHaveAttribute(
      "data-group-name",
      "Raspberry Pi",
    );
  });

  it("does not render the edit form for non-maintainers", () => {
    renderPage();

    expect(screen.queryByTestId("create-group-form")).not.toBeInTheDocument();
  });

  it("renders only articles belonging to the current group", () => {
    renderPage();

    expect(screen.getByTestId("article-list")).toBeInTheDocument();
    expect(screen.getByText("Pi guide")).toBeInTheDocument();
    expect(screen.queryByText("Arduino guide")).not.toBeInTheDocument();
  });

  it("does not render the article list when the group has no articles", () => {
    renderPage({ articleData: [] });

    expect(screen.queryByTestId("article-list")).not.toBeInTheDocument();
  });

  it("renders known issues when the group has them", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "Known Type Issues" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Power supply issues")).toBeInTheDocument();
  });

  it("does not render known issues when none are configured", () => {
    renderPage({ id: "3" });

    expect(
      screen.queryByRole("heading", { name: "Known Type Issues" }),
    ).not.toBeInTheDocument();
  });

  it("redirects to /units when id is 0", () => {
    renderPage({ id: "0" });

    expect(mocks.redirect).toHaveBeenCalledWith("/units");
  });

  it("replaces the route with /types when the group does not exist", async () => {
    renderPage({ id: "999" });

    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith("/types");
    });
  });

  it("refreshes groups after a successful update", () => {
    renderPage({ role_id: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Update success" }));

    expect(screen.getByTestId("toast-message")).toHaveTextContent(
      "Type successfully updated.",
    );
    expect(mocks.refreshGroups).toHaveBeenCalledOnce();
  });

  it("shows an error after a failed update", () => {
    renderPage({ role_id: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Update failure" }));

    expect(screen.getByTestId("toast-message")).toHaveTextContent(
      "Failed to update type.",
    );
    expect(mocks.refreshGroups).not.toHaveBeenCalled();
  });

  it("refreshes all relevant data and redirects after successful deletion", () => {
    renderPage({ role_id: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Delete success" }));

    expect(screen.getByTestId("toast-message")).toHaveTextContent(
      "Type successfully deleted.",
    );
    expect(mocks.refreshGroups).toHaveBeenCalledOnce();
    expect(mocks.refreshItems).toHaveBeenCalledOnce();
    expect(mocks.refreshArticles).toHaveBeenCalledOnce();
    expect(mocks.replace).toHaveBeenCalledWith("/units/by-type/1");
  });

  it("shows an error after a failed deletion", () => {
    renderPage({ role_id: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Delete failure" }));

    expect(screen.getByTestId("toast-message")).toHaveTextContent(
      "Failed to delete type.",
    );
    expect(mocks.refreshGroups).not.toHaveBeenCalled();
    expect(mocks.refreshItems).not.toHaveBeenCalled();
    expect(mocks.refreshArticles).not.toHaveBeenCalled();
  });
});

