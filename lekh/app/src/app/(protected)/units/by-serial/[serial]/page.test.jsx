
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const { router } = vi.hoisted(() => ({
  router: {
    push: vi.fn(),
  },
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, use: (value) => value };
});

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

import { EquipmentContext } from "@/context/equipment-context";
import Page from "./page";

const items = [
  { id: 10, name: "Oscilloscope", serial: "SCOPE-123" },
  { id: 11, name: "Soldering Station", serial: "SOLDER-456" },
];

const renderPage = ({
  serial = "SCOPE-123",
  itemData = items,
  loading = false,
} = {}) =>
  render(
    <EquipmentContext.Provider value={{ items: itemData, loading }}>
      <Page params={{ serial }} />
    </EquipmentContext.Provider>,
  );

describe("Unit serial lookup page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to the matching unit when loading is complete", async () => {
    renderPage();

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/units/by-id/10");
    });

    expect(screen.queryByText("Item not found.")).toBeNull();
  });

  it("does not redirect while items are loading", () => {
    const { container } = renderPage({ loading: true });

    expect(router.push).not.toHaveBeenCalled();
    expect(container.firstChild).toBeNull();
  });

  it("redirects after loading finishes and the serial matches", async () => {
    const { rerender } = render(
      <EquipmentContext.Provider value={{ items, loading: true }}>
        <Page params={{ serial: "SOLDER-456" }} />
      </EquipmentContext.Provider>,
    );

    expect(router.push).not.toHaveBeenCalled();

    rerender(
      <EquipmentContext.Provider value={{ items, loading: false }}>
        <Page params={{ serial: "SOLDER-456" }} />
      </EquipmentContext.Provider>,
    );

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/units/by-id/11");
    });
  });

  it("shows not found when loading is complete and no serial matches", () => {
    renderPage({ serial: "UNKNOWN-999" });

    expect(screen.getByText("Item not found.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("does not show not found while loading, even when no item matches", () => {
    const { container } = renderPage({
      serial: "UNKNOWN-999",
      loading: true,
    });

    expect(container.firstChild).toBeNull();
    expect(screen.queryByText("Item not found.")).toBeNull();
    expect(router.push).not.toHaveBeenCalled();
  });
});

