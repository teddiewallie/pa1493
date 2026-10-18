
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateItemForm } from "./create-item-form";
import { EquipmentContext } from "@/context/equipment-context";
import { saveItem } from "@/service/save-item";

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => async (values) => ({ values, errors: {} }),
}));

vi.mock("@/schema/item-schema", () => ({
  createItemSchema: () => ({}),
}));

vi.mock("@/service/save-item", () => ({
  saveItem: vi.fn(),
}));

vi.mock("@/components/ui/field", () => ({
  Field: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
  FieldLabel: ({ children, ...props }) => <label {...props}>{children}</label>,
  FieldSet: ({ children, ...props }) => <fieldset {...props}>{children}</fieldset>,
  FieldError: () => null,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props) => <input {...props} />,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props) => <textarea {...props} />,
}));

vi.mock("@/components/ui/select", async () => {
  const React = await import("react");
  const SelectContext = React.createContext(null);

  return {
    Select: ({ value, onValueChange, children, ...props }) => (
      <SelectContext.Provider value={{ value, onValueChange }}>
        <div data-testid="select" data-value={value} {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    ),
    SelectContent: ({ children }) => <div>{children}</div>,
    SelectItem: ({ value, children }) => {
      const context = React.useContext(SelectContext);

      return (
        <button
          type="button"
          onClick={() => context.onValueChange(value)}
        >
          {children}
        </button>
      );
    },
    SelectTrigger: ({ children, ...props }) => <div {...props}>{children}</div>,
    SelectValue: ({ children }) => <span>{children}</span>,
  };
});

vi.mock("@/components/image-picker", () => ({
  ImagePicker: ({ current, onChange }) => (
    <div>
      <span data-testid="current-image">{current ?? "no image"}</span>
      <button
        type="button"
        onClick={() =>
          onChange(new File(["image"], "unit.png", { type: "image/png" }))
        }
      >
        Choose image
      </button>
    </div>
  ),
}));

vi.mock("@/components/create-item-form/create-item-reservation-radio", () => ({
  CreateItemReservationRadio: ({ form, field }) => (
    <div>
      <button
        type="button"
        onClick={() => {
          const next = !field.value;
          field.onChange(next);
          form.setValue("bookable", next, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      >
        Toggle reservation
      </button>
      <span data-testid="borrowable">{String(field.value)}</span>
    </div>
  ),
}));

const statuses = [
  { id: 1, name: "Available" },
  { id: 2, name: "On Loan" },
];

const groups = [
  { id: 1, name: "Ungrouped" },
  { id: 2, name: "Arduino" },
];

const renderForm = (props = {}) => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onFail: vi.fn(),
    statuses,
  };

  return render(
    <EquipmentContext.Provider value={{ groups: groups.map((group) => ({ ...group })) }}>
      <CreateItemForm {...defaultProps} {...props} />
    </EquipmentContext.Provider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CreateItemForm", () => {
  it("renders the form fields and save button", () => {
    renderForm();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Serial")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Known Issues")).toBeInTheDocument();
    expect(screen.getByLabelText("Shelf")).toBeInTheDocument();
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ungrouped").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Save Unit" })).toBeInTheDocument();
  });

  it("populates the fields when editing an existing item", () => {
    renderForm({
      item: {
        id: 42,
        asset_id: 7,
        name: "Arduino Uno",
        serial: "ARD-001",
        description: "Microcontroller board",
        known_issues: "USB connector is loose",
        shelf: "B2",
        status_id: 2,
        group_id: 2,
        borrowable: true,
        bookable: true,
      },
    });

    expect(screen.getByLabelText("Name")).toHaveValue("Arduino Uno");
    expect(screen.getByLabelText("Serial")).toHaveValue("ARD-001");
    expect(screen.getByLabelText("Description")).toHaveValue("Microcontroller board");
    expect(screen.getByLabelText("Known Issues")).toHaveValue("USB connector is loose");
    expect(screen.getByLabelText("Shelf")).toHaveValue("B2");
    expect(screen.getAllByText("On Loan").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Arduino").length).toBeGreaterThan(0);
    expect(screen.getByTestId("borrowable")).toHaveTextContent("true");
    expect(screen.getByTestId("current-image")).toHaveTextContent("/api/asset/7");
  });

  it("uses the supplied groupId when creating an item", async () => {
    saveItem.mockResolvedValue(true);
    const onSuccess = vi.fn();

    renderForm({ groupId: 2, onSuccess });

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "New Arduino" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Unit" }));

    await waitFor(() => {
      expect(saveItem).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Arduino",
          groupId: 2,
          statusId: 1,
          borrowable: false,
          bookable: false,
        })
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("updates the status and group selections", async () => {
    saveItem.mockResolvedValue(true);

    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "On Loan" }));
    fireEvent.click(screen.getByRole("button", { name: "Arduino" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Unit" }));

    await waitFor(() => {
      expect(saveItem).toHaveBeenCalledWith(
        expect.objectContaining({
          statusId: 2,
          groupId: 2,
        })
      );
    });
  });

  it("passes the chosen image and reservation settings to saveItem", async () => {
    saveItem.mockResolvedValue(true);

    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Choose image" }));
    fireEvent.click(screen.getByRole("button", { name: "Toggle reservation" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Unit" }));

    await waitFor(() => {
      expect(saveItem).toHaveBeenCalledWith(
        expect.objectContaining({
          borrowable: true,
          bookable: true,
          image: expect.any(File),
        })
      );
    });

    expect(saveItem.mock.calls[0][0].image.name).toBe("unit.png");
  });

  it("calls onSuccess when saving succeeds", async () => {
    saveItem.mockResolvedValue({ id: 42 });
    const onSuccess = vi.fn();
    const onFail = vi.fn();

    renderForm({ onSuccess, onFail });

    fireEvent.click(screen.getByRole("button", { name: "Save Unit" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onFail).not.toHaveBeenCalled();
    });
  });

  it("calls onFail when saving returns a falsy result", async () => {
    saveItem.mockResolvedValue(null);
    const onSuccess = vi.fn();
    const onFail = vi.fn();

    renderForm({ onSuccess, onFail });

    fireEvent.click(screen.getByRole("button", { name: "Save Unit" }));

    await waitFor(() => {
      expect(onFail).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});

