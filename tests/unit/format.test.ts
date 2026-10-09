import { describe, expect, it } from "vitest";
import { formatPeriod } from "../../lib/format";

describe("formatPeriod", () => {
  it("formats open, multi-year and single-year ranges", () => {
    expect(formatPeriod("2025-07", null)).toBe("2025 — now");
    expect(formatPeriod("2024-03", "2025-10")).toBe("2024 — 2025");
    expect(formatPeriod("2024-02", "2024-05")).toBe("2024");
  });
});
