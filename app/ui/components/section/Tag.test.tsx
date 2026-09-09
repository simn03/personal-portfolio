import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Tag from "./Tag.component";

function chipClass(container: HTMLElement): string {
  const chip = container.querySelector(".chip");
  expect(chip).toBeTruthy();
  return chip!.className;
}

describe("Tag", () => {
  it("renders its children", () => {
    const { getByText } = render(<Tag>React</Tag>);
    expect(getByText("React")).toBeTruthy();
  });

  it("uses the idle chip style by default", () => {
    const { container } = render(<Tag>React</Tag>);
    expect(chipClass(container)).toContain("chip-idle");
  });

  it("uses the selected chip style when selected", () => {
    const { container } = render(<Tag isSelected>React</Tag>);
    expect(chipClass(container)).toContain("chip-selected");
    expect(chipClass(container)).not.toContain("chip-unselected");
  });

  it("uses the unselected chip style when excluded", () => {
    const { container } = render(<Tag isUnselected>React</Tag>);
    expect(chipClass(container)).toContain("chip-unselected");
    expect(chipClass(container)).not.toContain("chip-selected");
  });

  it("does not advertise hover styling when disabled", () => {
    const { container } = render(<Tag shouldHover={false}>React</Tag>);
    expect(chipClass(container)).not.toContain("hover:");
  });
});
