import { describe, it, expect } from "vitest";
import { Thunderbolt } from "../src/core.js";
describe("Thunderbolt", () => {
  it("init", () => { expect(new Thunderbolt().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Thunderbolt(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Thunderbolt(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
