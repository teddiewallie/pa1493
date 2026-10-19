import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const { router } = vi.hoisted(() => ({
  router: {
    push: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

vi.mock("@/components/Html5QrcodeWrapper", () => ({
  Html5QrcodeWrapper: ({ onScan }) => (
    <button onClick={() => onScan("SENSOR-123")}>
      Simulate scan
    </button>
  ),
}));

import Page from "./page";

describe("QR page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to the unit matching the scanned serial number", () => {
    render(<Page />);

    fireEvent.click(screen.getByRole("button", { name: "Simulate scan" }));

    expect(router.push).toHaveBeenCalledWith("/units/by-serial/SENSOR-123");
  });
});

