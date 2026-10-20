import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ArticleContext } from "@/context/article-context";
import { toast } from "@/components/ui/toast";
import Page from "./page";

const { mockReplace, mockRedirect } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockRedirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  redirect: mockRedirect,
}));

vi.mock("next/link", () => ({
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));

vi.mock("lucide-react", () => ({
  CircleArrowLeft: () => null,
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
  ModalWithToast: ({ title, children }) => (
    <div>
      <span>{title}</span>
      {children}
    </div>
  ),
}));

vi.mock("@/components/create-group-form", () => ({
  CreateGroupForm: ({
    onSuccess,
    onFail,
    onDeleteSuccess,
    onDeleteFail,
  }) => (
    <>
      <button onClick={onSuccess}>Edit success</button>
      <button onClick={onFail}>Edit failure</button>
      <button onClick={onDeleteSuccess}>Delete success</button>
      <button onClick={onDeleteFail}>Delete failure</button>
    </>
  ),
}));

vi.mock("@/components/simple-card", () => ({
  SimpleCard: ({ title, description, content }) => (
    <div>
      <span>{title}</span>
      <span>{description}</span>
      <span>{content}</span>
    </div>
  ),
}));

vi.mock("@/components/link-button", () => ({
  LinkButton: ({ href, children }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/article-list", () => ({
  ArticleList: ({ articles }) => (
    <div data-testid="article-list">
      {articles.map((article) => (
        <span key={article.id}>{article.title}</span>
      ))}
    </div>
  ),
}));

vi.mock("@/components/ui/toast", () => ({
  toast: { add: vi.fn() },
}));

describe("Type details page", () => {
  const group = {
    id: 10,
    name: "Computers",
    known_issues: "Keep equipment dry.",
  };

  const articles = [
    { id: 1, title: "Computer guide", group_id: 10 },
    { id: 2, title: "Computer projects", group_id: 10 },
    { id: 3, title: "Sensor guide", group_id: 20 },
  ];

  let refreshGroups;
  let refreshItems;
  let refreshArticles;

  const renderPage = async ({
    id = "10",
    roleId = 2,
    groups = [group],
    articles: pageArticles = articles,
    loading = false,
  } = {}) => {
    const user = userEvent.setup();
    const params = Promise.resolve({ id });

    await act(async () => {
      render(
        <EquipmentContext.Provider
          value={{
            groups,
            refreshGroups,
            refreshItems,
            loading,
          }}
        >
          <UserContext.Provider value={{ user: { id: 7, role_id: roleId } }}>
            <ArticleContext.Provider
              value={{
                articles: pageArticles,
                articleTypes: [],
                refreshArticles,
              }}
            >
              <Page params={params} />
            </ArticleContext.Provider>
          </UserContext.Provider>
        </EquipmentContext.Provider>
      );

      await params;
    });

    return user;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    refreshGroups = vi.fn();
    refreshItems = vi.fn();
    refreshArticles = vi.fn();
  });

  it("renders the group name and links back to the types page", async () => {
    await renderPage();

    expect(
      await screen.findByRole("link", { name: "Computers" })
    ).toHaveAttribute("href", "/types");

    expect(screen.getByTestId("item-list")).toHaveAttribute(
      "data-group-id",
      "10"
    );
  });

  it("renders only articles belonging to the current group", async () => {
    await renderPage();

    expect(await screen.findByText("Computer guide")).toBeInTheDocument();
    expect(screen.getByText("Computer projects")).toBeInTheDocument();
    expect(screen.queryByText("Sensor guide")).not.toBeInTheDocument();
  });

  it("renders known type issues when present", async () => {
    await renderPage();

    expect(
      await screen.findByText("Known Type Issues")
    ).toBeInTheDocument();

    expect(screen.getByText("Type spanning issues.")).toBeInTheDocument();
    expect(screen.getByText("Keep equipment dry.")).toBeInTheDocument();
  });

  it("does not render known type issues when none are defined", async () => {
    await renderPage({
      groups: [{ ...group, known_issues: "" }],
    });

    expect(
      await screen.findByTestId("item-list")
    ).toBeInTheDocument();

    expect(screen.queryByText("Known Type Issues")).not.toBeInTheDocument();
  });

  it("shows Add Article for grouped types", async () => {
    await renderPage();

    expect(
      screen.getByRole("link", { name: "Add Article" })
    ).toHaveAttribute("href", "/editor/for-type/10");
  });

  it("does not show Add Article for Ungrouped", async () => {
    await renderPage({
      id: "1",
      groups: [{ id: 1, name: "Ungrouped" }],
      articles: [],
    });

    expect(
      screen.queryByRole("link", { name: "Add Article" })
    ).not.toBeInTheDocument();
  });
  
  it("shows Edit Type only to maintainers", async () => {
    await renderPage({ roleId: 1 });

    expect(await screen.findByText("Edit Type")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit success" })).toBeInTheDocument();
  });

  it("refreshes groups and shows a toast after a successful update", async () => {
    const user = await renderPage({ roleId: 1 });

    await user.click(screen.getByRole("button", { name: "Edit success" }));

    expect(toast.add).toHaveBeenCalledWith({
      title: "Type successfully updated.",
    });
    expect(refreshGroups).toHaveBeenCalledOnce();
  });

  it("shows an error toast when updating the type fails", async () => {
    const user = await renderPage({ roleId: 1 });

    await user.click(screen.getByRole("button", { name: "Edit failure" }));

    expect(toast.add).toHaveBeenCalledWith({
      title: "Failed to update type.",
    });
    expect(refreshGroups).not.toHaveBeenCalled();
  });

  it("refreshes related data and redirects after successful deletion", async () => {
    const user = await renderPage({ roleId: 1 });

    await user.click(screen.getByRole("button", { name: "Delete success" }));

    expect(toast.add).toHaveBeenCalledWith({
      title: "Type successfully deleted.",
    });
    expect(refreshGroups).toHaveBeenCalledOnce();
    expect(refreshItems).toHaveBeenCalledOnce();
    expect(refreshArticles).toHaveBeenCalledOnce();
    expect(mockReplace).toHaveBeenCalledWith("/units/by-type/1");
  });

  it("shows an error toast when deleting the type fails", async () => {
    const user = await renderPage({ roleId: 1 });

    await user.click(screen.getByRole("button", { name: "Delete failure" }));

    expect(toast.add).toHaveBeenCalledWith({
      title: "Failed to delete type.",
    });
    expect(refreshGroups).not.toHaveBeenCalled();
    expect(refreshItems).not.toHaveBeenCalled();
    expect(refreshArticles).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to /types when the group is missing and loading has finished", async () => {
    await renderPage({ groups: [], loading: false });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/types");
    });
  });

  it("redirects to /units when the group ID is 0", async () => {
    await renderPage({ id: "0" });

    expect(mockRedirect).toHaveBeenCalledWith("/units");
  });
});
