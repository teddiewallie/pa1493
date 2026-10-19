import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BottomBar } from "./bottom-bar";
import { UserContext } from "@/context/user-context";
import { routes } from "@/routes";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({}),
}));

vi.mock("@/components/sign-out-button", () => ({
  SignOutButton: ({ type }) => (
    <button type="button" data-testid="sign-out" data-type={type}>
      Sign out
    </button>
  ),
}));

vi.mock("@/routes", () => ({
  routes: [
    {
      key: "dashboard",
      route: "/dashboard",
      role_id: 1,
      Icon: ({ size }) => (
        <span data-testid="route-icon" data-size={size} />
      ),
    },
    {
      key: "articles",
      route: "/articles",
      role_id: 2,
      Icon: ({ size }) => (
        <span data-testid="route-icon" data-size={size} />
      ),
    },
    {
      key: "admin",
      route: "/admin",
      role_id: 1,
      Icon: ({ size }) => (
        <span data-testid="route-icon" data-size={size} />
      ),
    },
  ],
}));

const renderBottomBar = (roleId) => {
  const user = { role_id: roleId };

  return render(
    <UserContext.Provider value={{ user }}>
      <BottomBar />
    </UserContext.Provider>
  );
};

describe("BottomBar", () => {
  it("renders the footer", () => {
    renderBottomBar(1);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders only routes permitted for the current user's role", () => {
    renderBottomBar(2);

    const links = screen.getAllByRole("link");
    const expectedRoutes = routes.filter(
      (route) => route.role_id >= 2
    );

    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      expectedRoutes.map((route) => route.route)
    );
  });

  it("renders the sign-out button with the bottom-bar type", () => {
    renderBottomBar(1);

    expect(screen.getByTestId("sign-out")).toHaveAttribute(
      "data-type",
      "bottom-bar"
    );
  });

  it("renders route icons at size 32", () => {
    renderBottomBar(1);

    const icons = screen.getAllByTestId("route-icon");

    expect(icons.length).toBeGreaterThan(0);

    icons.forEach((icon) => {
      expect(icon).toHaveAttribute("data-size", "32");
    });
  });
});

