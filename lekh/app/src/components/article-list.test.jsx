import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ArticleList } from "./article-list";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }) => <section>{children}</section>,
  CardDescription: ({ children }) => <p>{children}</p>,
  CardHeader: ({ children }) => <header>{children}</header>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <h2>{children}</h2>,
}));

vi.mock("@/components/article-row", () => ({
  ArticleRow: ({ article, articleTypes }) => (
    <li>
      <span>{article.title}</span>
      <span data-testid={`article-types-${article.id}`}>
        {JSON.stringify(articleTypes)}
      </span>
    </li>
  ),
}));

describe("ArticleList", () => {
  const articles = [
    { id: 1, title: "Getting Started" },
    { id: 2, title: "Equipment Guide" },
  ];

  const articleTypes = [
    { id: 1, name: "Guide" },
    { id: 2, name: "Documentation" },
  ];

  it("renders the supplied title", () => {
    render(
      <ArticleList
        articles={articles}
        articleTypes={articleTypes}
        title="My Articles"
      />
    );

    expect(
      screen.getByRole("heading", { name: "My Articles" })
    ).toBeInTheDocument();
  });

  it("defaults the title to Articles", () => {
    render(
      <ArticleList
        articles={articles}
        articleTypes={articleTypes}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Articles" })
    ).toBeInTheDocument();
  });

  it("renders every article", () => {
    render(
      <ArticleList
        articles={articles}
        articleTypes={articleTypes}
      />
    );

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Equipment Guide")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("passes articleTypes to each ArticleRow", () => {
    render(
      <ArticleList
        articles={articles}
        articleTypes={articleTypes}
      />
    );

    for (const article of articles) {
      expect(
        screen.getByTestId(`article-types-${article.id}`)
      ).toHaveTextContent(JSON.stringify(articleTypes));
    }
  });

  it("renders an empty list when there are no articles", () => {
    render(
      <ArticleList
        articles={[]}
        articleTypes={articleTypes}
      />
    );

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
