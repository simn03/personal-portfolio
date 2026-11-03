import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ListItem from "./ListItem.component";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement("img", props),
  };
});

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("ListItem", () => {
  it("renders the role, badge and a jump to the linked project", () => {
    render(
      <ListItem
        title="LeaserFlow"
        badge="Freelance"
        project="leaserflow"
        metadata={["React"]}
        description={["Full-Stack Developer", "Built it."]}
        startDate="2024-10-01"
        endDate="2025-11-01"
      />
    );
    expect(screen.getByText("Full-Stack Developer")).toBeTruthy();
    expect(screen.getByText("Freelance")).toBeTruthy();
    expect(screen.getByRole("button", { name: /see the project/i })).toBeTruthy();
  });

  it("shows a plain title and a monogram when there is no link or logo", () => {
    render(<ListItem title="Wyndo" metadata={["React"]} description={["Co-founder"]} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("heading", { name: "Wyndo" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /see the project/i })).toBeNull();
  });
});

describe("ListItem details", () => {
  it("starts collapsed and expands on demand", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    render(
      <ListItem
        title="Broadcom"
        metadata={["Java"]}
        description={["Software Engineer Co-op", "Built revision history."]}
      />
    );
    const toggle = screen.getByRole("button", { name: /details/i });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    // Header and footer stay visible while collapsed.
    expect(screen.getByText("Software Engineer Co-op")).toBeTruthy();
    expect(screen.getByText("Java")).toBeTruthy();
    expect(screen.getByText("Built revision history.").closest("[inert]")).toBeTruthy();

    await user.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Built revision history.").closest("[inert]")).toBeNull();
  });
});

describe("ListItem dates", () => {
  it("reads 'Present' for an ongoing role with no dates", () => {
    render(<ListItem title="Wyndo" metadata={["React"]} description={["Co-founder"]} />);
    expect(screen.getByText("Present")).toBeTruthy();
  });
});
