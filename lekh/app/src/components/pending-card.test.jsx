import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PendingCard } from "./pending-card";
import {
  approveReservation,
  denyReservation,
} from "@/service/save-reservation";
import { toast } from "@/components/ui/toast";

vi.mock("@/service/save-reservation", () => ({
  approveReservation: vi.fn(),
  denyReservation: vi.fn(),
}));

vi.mock("@/components/ui/toast", () => ({
  toast: {
    add: vi.fn(),
  },
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }) => <p {...props}>{children}</p>,
  CardFooter: ({ children, ...props }) => <footer {...props}>{children}</footer>,
  CardHeader: ({ children, ...props }) => <header {...props}>{children}</header>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
}));

vi.mock("next/image", () => ({
  default: (props) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const item = {
  id: 42,
  name: "Oscilloscope",
  serial: "OSC-123",
  asset_id: 7,
};

const pending = {
  id: 15,
  start_at: "2026-10-20",
  end_at: "2026-10-24",
};

const user = {
  name: "Alex Student",
};

const renderCard = (refresh = vi.fn()) => {
  const result = render(
    <PendingCard
      item={item}
      pending={pending}
      user={user}
      refresh={refresh}
    />
  );

  return { ...result, refresh };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PendingCard", () => {
  it("renders the user, reservation dates, and linked item", () => {
    renderCard();

    expect(
      screen.getByRole("heading", { name: "Alex Student" })
    ).toBeInTheDocument();

    expect(screen.getByText("2026-10-20 - 2026-10-24"))
      .toBeInTheDocument();

    const itemLink = screen.getByRole("link", {
      name: /Oscilloscope - OSC-123/,
    });

    expect(itemLink).toHaveAttribute("href", "/units/by-id/42");

    const image = document.querySelector('img[src="/api/asset/7"]');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "");

    expect(screen.getByRole("button", { name: "Deny" }))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" }))
      .toBeInTheDocument();
  });

  it("approves the reservation, displays a success toast, and refreshes", async () => {
    approveReservation.mockResolvedValue(true);
    const { refresh } = renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => {
      expect(approveReservation).toHaveBeenCalledWith(15);
      expect(toast.add).toHaveBeenCalledWith({
        title: "Request approved.",
      });
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });

  it("displays an error toast when approval fails and refreshes", async () => {
    approveReservation.mockResolvedValue(false);
    const { refresh } = renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => {
      expect(approveReservation).toHaveBeenCalledWith(15);
      expect(toast.add).toHaveBeenCalledWith({
        title: "Error approving request.",
      });
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });

  it("denies the reservation, displays a success toast, and refreshes", async () => {
    denyReservation.mockResolvedValue(true);
    const { refresh } = renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Deny" }));

    await waitFor(() => {
      expect(denyReservation).toHaveBeenCalledWith(15);
      expect(toast.add).toHaveBeenCalledWith({
        title: "Request denied.",
      });
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });

  it("displays an error toast when denial fails and refreshes", async () => {
    denyReservation.mockResolvedValue(false);
    const { refresh } = renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Deny" }));

    await waitFor(() => {
      expect(denyReservation).toHaveBeenCalledWith(15);
      expect(toast.add).toHaveBeenCalledWith({
        title: "Error denying request.",
      });
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });
});

