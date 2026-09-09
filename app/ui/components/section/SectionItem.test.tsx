import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SectionItem from "./SectionItem.component";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement("img", props),
  };
});

const manyTags = ["MySQL", "TypeScript", "Vite", "React", "hapi.js", "socket.io"];

describe("SectionItem", () => {
  it("renders a catalogue number from its grid position", () => {
    render(<SectionItem index={0} title="LeaserFlow" metadata={[]} />);
    expect(screen.getByText("01")).toBeTruthy();

    render(<SectionItem index={11} title="Twelfth" metadata={[]} />);
    expect(screen.getByText("12")).toBeTruthy();
  });

  it("shows only the lead description on the card", () => {
    render(
      <SectionItem
        title="LeaserFlow"
        metadata={[]}
        description={["Lead line.", "Second detail.", "Third detail."]}
      />
    );
    expect(screen.getByText("Lead line.")).toBeTruthy();
    expect(screen.queryByText("Second detail.")).toBeNull();
  });

  it("caps the tag row and lists the overflow in a tooltip", () => {
    render(<SectionItem title="LeaserFlow" metadata={manyTags} />);

    expect(screen.getByText("MySQL")).toBeTruthy();
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.queryByText("socket.io")).toBeNull();

    const overflow = screen.getByTitle("hapi.js, socket.io");
    expect(overflow.textContent).toBe("+2");
  });

  it("does not show an overflow chip when every tag fits", () => {
    render(<SectionItem title="Small" metadata={["React", "Vite"]} />);
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  });

  it("advertises the gallery size when a project has several images", () => {
    render(
      <SectionItem title="LeaserFlow" metadata={[]} images={["/a.png", "/b.png", "/c.png"]} />
    );
    const trigger = screen.getByRole("button", { name: /open the leaserflow gallery/i });
    expect(trigger.textContent).toContain("3");
  });

  it("reveals every description bullet in the dialog", async () => {
    const user = userEvent.setup();
    render(
      <SectionItem
        title="LeaserFlow"
        metadata={manyTags}
        images={["/a.png", "/b.png"]}
        url="https://leaserflow.com"
        description={["Lead line.", "Second detail.", "Third detail."]}
      />
    );

    await user.click(screen.getByRole("button", { name: /open the leaserflow gallery/i }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog.textContent).toContain("Second detail.");
    expect(dialog.textContent).toContain("Third detail.");
    // every tag, including the ones the card collapsed
    expect(dialog.textContent).toContain("socket.io");
    expect(
      screen.getByRole("link", { name: /visit LeaserFlow/i }).getAttribute("href")
    ).toBe("https://leaserflow.com");
  });
});
