import { describe, expect, it } from "vitest";
import { formatSarajevoTime } from "../../components/ui/LocalTime";

describe("formatSarajevoTime", () => {
  it("formats in Europe/Sarajevo 24h with the zone label", () => {
    expect(formatSarajevoTime(new Date("2026-01-15T11:05:00Z"))).toBe("12:05 CET");
    expect(formatSarajevoTime(new Date("2026-07-15T11:05:00Z"))).toBe("13:05 CEST");
  });
});
