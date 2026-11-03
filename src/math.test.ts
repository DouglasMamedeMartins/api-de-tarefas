import { describe, it, expect } from "vitest";

describe("soma", () => {
  it("deve somar dois números", () => {
    expect(2 + 3).toBe(5);
  });

  it("deve subtrair dois números", () => {
    expect(10 - 4).toBe(6);
  });
});
