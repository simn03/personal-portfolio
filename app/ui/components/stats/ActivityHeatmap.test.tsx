import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ActivityHeatmap from "./ActivityHeatmap.component";

/** Builds `weeks * 7` consecutive zero-count days ending today. */
function buildPoints(weeks: number) {
  const days = weeks * 7;
  const points = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    points.push({ date: date.toISOString().slice(0, 10), value: 0 });
  }
  return points;
}

describe("ActivityHeatmap", () => {
  it("renders a cell per day and the accessible grid label", () => {
    const weeks = 4;
    const { container } = render(
      <ActivityHeatmap
        points={buildPoints(weeks)}
        weeks={weeks}
        unit="plays"
        ariaLabel="Listening activity over the last 4 weeks"
      />
    );

    expect(screen.getByRole("img", { name: "Listening activity over the last 4 weeks" })).toBeTruthy();
    // One .size-[10px] cell per grid slot (weeks * 7), future or past.
    expect(container.querySelectorAll(".size-\\[10px\\]")).toHaveLength(weeks * 7);
  });

  it("shows four weekday labels (locale-dependent start day) and a less→more legend", () => {
    render(
      <ActivityHeatmap points={buildPoints(2)} weeks={2} unit="watches" ariaLabel="Watching activity" />
    );

    // Either Mon/Wed/Fri/Sun (week starts Monday) or Sun/Tue/Thu/Sat (starts Sunday).
    const labelled = ["Mon", "Wed", "Fri", "Sun", "Tue", "Thu", "Sat"].filter((day) =>
      screen.queryByText(day)
    );
    expect(labelled).toHaveLength(4);

    expect(screen.getByText("less")).toBeTruthy();
    expect(screen.getByText("more")).toBeTruthy();
  });

  it("renders exactly five legend swatches", () => {
    const { container } = render(
      <ActivityHeatmap points={buildPoints(1)} weeks={1} unit="plays" ariaLabel="Activity" />
    );

    expect(container.querySelectorAll(".size-\\[9px\\]")).toHaveLength(5);
  });
});
