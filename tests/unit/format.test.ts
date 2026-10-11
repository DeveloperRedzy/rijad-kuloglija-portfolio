import { describe, expect, it } from "vitest";
import { formatDay, formatPeriod, formatPeriodMonths } from "../../lib/format";

describe("formatPeriod", () => {
  it("formats open, multi-year and single-year ranges", () => {
    expect(formatPeriod("2025-07", null)).toBe("2025 — present");
    expect(formatPeriod("2024-03", "2025-10")).toBe("2024 — 2025");
    expect(formatPeriod("2024-02", "2024-05")).toBe("2024");
  });
});

describe("formatPeriodMonths", () => {
  it("formats open, multi-year, same-year and single-month ranges", () => {
    expect(formatPeriodMonths("2025-07", null)).toBe("Jul 2025 — present");
    expect(formatPeriodMonths("2024-10", "2025-03")).toBe("Oct 2024 — Mar 2025");
    expect(formatPeriodMonths("2024-02", "2024-05")).toBe("Feb — May 2024");
    expect(formatPeriodMonths("2024-02", "2024-02")).toBe("Feb 2024");
  });
});

describe("formatDay", () => {
  it("formats an ISO date as day, short month and year", () => {
    expect(formatDay("2026-10-10")).toBe("10 Oct 2026");
    expect(formatDay("2026-01-05")).toBe("5 Jan 2026");
  });
});
