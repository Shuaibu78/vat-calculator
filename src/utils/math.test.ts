import { describe, it, expect } from "vitest";
import { roundToDecimal, addVat, extractVat, calculateVat } from "./math";

describe("roundToDecimal", () => {
  it("should round to 2 decimal places by default", () => {
    expect(roundToDecimal(10.125)).toBe(10.13);
    expect(roundToDecimal(10.124)).toBe(10.12);
    expect(roundToDecimal(10.1)).toBe(10.1);
  });

  it("should handle floating-point precision issues", () => {
    // Classic JavaScript floating-point error: 0.1 + 0.2 = 0.30000000000000004
    const result = 0.1 + 0.2;
    expect(result).not.toBe(0.3); // Demonstrates the problem
    expect(roundToDecimal(result)).toBe(0.3); // Our function fixes it
  });

  it("should round to specified decimal places", () => {
    expect(roundToDecimal(10.12345, 3)).toBe(10.123);
    expect(roundToDecimal(10.12345, 1)).toBe(10.1);
    expect(roundToDecimal(10.12345, 0)).toBe(10);
  });

  it("should handle negative numbers", () => {
    expect(roundToDecimal(-10.125)).toBe(-10.12); // Rounds towards zero for .5
    expect(roundToDecimal(-10.126)).toBe(-10.13);
    expect(roundToDecimal(-10.124)).toBe(-10.12);
  });

  it("should handle zero", () => {
    expect(roundToDecimal(0)).toBe(0);
    expect(roundToDecimal(0.001)).toBe(0);
  });
});

describe("addVat", () => {
  it("should calculate VAT correctly for Nigerian rate (7.5%)", () => {
    const result = addVat(100, 7.5);

    expect(result.mode).toBe("add");
    expect(result.vatRate).toBe(7.5);
    expect(result.priceExcludingVat).toBe(100);
    expect(result.vatAmount).toBe(7.5);
    expect(result.priceIncludingVat).toBe(107.5);
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it("should handle standard UK VAT rate (20%)", () => {
    const result = addVat(100, 20);

    expect(result.priceExcludingVat).toBe(100);
    expect(result.vatAmount).toBe(20);
    expect(result.priceIncludingVat).toBe(120);
  });

  it("should handle decimal prices correctly", () => {
    const result = addVat(99.99, 7.5);

    expect(result.priceExcludingVat).toBe(99.99);
    expect(result.vatAmount).toBe(7.5); // 99.99 * 0.075 = 7.49925 → 7.50
    expect(result.priceIncludingVat).toBe(107.49);
  });

  it("should handle zero price", () => {
    const result = addVat(0, 7.5);

    expect(result.priceExcludingVat).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.priceIncludingVat).toBe(0);
  });

  it("should handle zero VAT rate", () => {
    const result = addVat(100, 0);

    expect(result.priceExcludingVat).toBe(100);
    expect(result.vatAmount).toBe(0);
    expect(result.priceIncludingVat).toBe(100);
  });

  it("should throw error for negative price", () => {
    expect(() => addVat(-100, 7.5)).toThrow("Price cannot be negative");
  });

  it("should throw error for invalid VAT rate", () => {
    expect(() => addVat(100, -5)).toThrow("VAT rate must be between 0 and 100");
    expect(() => addVat(100, 101)).toThrow(
      "VAT rate must be between 0 and 100"
    );
  });

  it("should handle floating-point precision for complex calculations", () => {
    // Test case that might cause floating-point errors
    const result = addVat(33.33, 7.5);

    expect(result.priceExcludingVat).toBe(33.33);
    expect(result.vatAmount).toBe(2.5); // 33.33 * 0.075 = 2.49975 → 2.50
    expect(result.priceIncludingVat).toBe(35.83);
  });
});

describe("extractVat", () => {
  it("should extract VAT correctly for Nigerian rate (7.5%)", () => {
    const result = extractVat(107.5, 7.5);

    expect(result.mode).toBe("extract");
    expect(result.vatRate).toBe(7.5);
    expect(result.priceExcludingVat).toBe(100);
    expect(result.vatAmount).toBe(7.5);
    expect(result.priceIncludingVat).toBe(107.5);
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it("should handle standard UK VAT rate (20%)", () => {
    const result = extractVat(120, 20);

    expect(result.priceExcludingVat).toBe(100);
    expect(result.vatAmount).toBe(20);
    expect(result.priceIncludingVat).toBe(120);
  });

  it("should handle decimal totals correctly", () => {
    const result = extractVat(107.49, 7.5);

    expect(result.priceIncludingVat).toBe(107.49);
    expect(result.priceExcludingVat).toBe(99.99); // 107.49 / 1.075 = 99.99069...
    expect(result.vatAmount).toBe(7.5); // 107.49 - 99.99 = 7.50
  });

  it("should handle zero total", () => {
    const result = extractVat(0, 7.5);

    expect(result.priceExcludingVat).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.priceIncludingVat).toBe(0);
  });

  it("should handle zero VAT rate", () => {
    const result = extractVat(100, 0);

    expect(result.priceExcludingVat).toBe(100);
    expect(result.vatAmount).toBe(0);
    expect(result.priceIncludingVat).toBe(100);
  });

  it("should throw error for negative total", () => {
    expect(() => extractVat(-100, 7.5)).toThrow(
      "Total price cannot be negative"
    );
  });

  it("should throw error for invalid VAT rate", () => {
    expect(() => extractVat(100, -5)).toThrow(
      "VAT rate must be between 0 and 100"
    );
    expect(() => extractVat(100, 101)).toThrow(
      "VAT rate must be between 0 and 100"
    );
  });

  it("should handle floating-point precision for complex calculations", () => {
    const result = extractVat(35.83, 7.5);

    expect(result.priceIncludingVat).toBe(35.83);
    expect(result.priceExcludingVat).toBe(33.33); // 35.83 / 1.075 = 33.3302...
    expect(result.vatAmount).toBe(2.5); // 35.83 - 33.33 = 2.50
  });
});

describe("calculateVat", () => {
  it('should route to addVat when mode is "add"', () => {
    const result = calculateVat(100, 7.5, "add");

    expect(result.mode).toBe("add");
    expect(result.priceExcludingVat).toBe(100);
    expect(result.vatAmount).toBe(7.5);
    expect(result.priceIncludingVat).toBe(107.5);
  });

  it('should route to extractVat when mode is "extract"', () => {
    const result = calculateVat(107.5, 7.5, "extract");

    expect(result.mode).toBe("extract");
    expect(result.priceExcludingVat).toBe(100);
    expect(result.vatAmount).toBe(7.5);
    expect(result.priceIncludingVat).toBe(107.5);
  });

  it("should produce consistent results for round-trip calculations", () => {
    // Add VAT to 100
    const added = calculateVat(100, 7.5, "add");

    // Extract VAT from the result
    const extracted = calculateVat(added.priceIncludingVat, 7.5, "extract");

    // Should get back to the original values
    expect(extracted.priceExcludingVat).toBe(100);
    expect(extracted.vatAmount).toBe(7.5);
    expect(extracted.priceIncludingVat).toBe(107.5);
  });

  it("should handle edge case with very small amounts", () => {
    const result = calculateVat(0.01, 7.5, "add");

    expect(result.priceExcludingVat).toBe(0.01);
    expect(result.vatAmount).toBe(0); // 0.01 * 0.075 = 0.00075 → 0.00
    expect(result.priceIncludingVat).toBe(0.01);
  });

  it("should handle edge case with very large amounts", () => {
    const result = calculateVat(1000000, 7.5, "add");

    expect(result.priceExcludingVat).toBe(1000000);
    expect(result.vatAmount).toBe(75000);
    expect(result.priceIncludingVat).toBe(1075000);
  });
});

describe("Real-world Nigerian VAT scenarios", () => {
  it("should calculate VAT for typical grocery bill", () => {
    const result = addVat(5000, 7.5); // ₦5,000 groceries

    expect(result.priceExcludingVat).toBe(5000);
    expect(result.vatAmount).toBe(375); // ₦375 VAT
    expect(result.priceIncludingVat).toBe(5375); // ₦5,375 total
  });

  it("should extract VAT from restaurant bill", () => {
    const result = extractVat(12900, 7.5); // ₦12,900 total bill

    expect(result.priceIncludingVat).toBe(12900);
    expect(result.priceExcludingVat).toBe(12000); // ₦12,000 before VAT
    expect(result.vatAmount).toBe(900); // ₦900 VAT
  });

  it("should handle service invoice with VAT", () => {
    const result = addVat(250000, 7.5); // ₦250,000 service fee

    expect(result.priceExcludingVat).toBe(250000);
    expect(result.vatAmount).toBe(18750); // ₦18,750 VAT
    expect(result.priceIncludingVat).toBe(268750); // ₦268,750 total
  });
});
