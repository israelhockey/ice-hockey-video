import { describe, expect, it } from "vitest";
import { average } from "@/routes/_authenticated/admin";
describe("feedback rating average", () => {
  it("ignores blank ratings and rounds to one decimal", () => {
    expect(average([5, 4, null, 4])).toBe(4.3);
  });
  it("is empty when nobody rated", () => {
    expect(average([null])).toBeNull();
  });
});
