import calcAveragesNegativeAndPositive from "./index";

test("Average Positives, negatives and zeros", () => {
    expect(calcAveragesNegativeAndPositive([])).toBe([null, null]);
    expect(calcAveragesNegativeAndPositive([1, 2, 3, -1, -2, -3])).toBe([2, -2]);
    expect(calcAveragesNegativeAndPositive([1, 2, 3, 0 ,-1, -2, -3])).toBe([2, -2]);
    expect(calcAveragesNegativeAndPositive([0, 0, 0, 0])).toBe([null, null]);
    expect(calcAveragesNegativeAndPositive([1, 2, 3])).toBe([2]);
    expect(calcAveragesNegativeAndPositive([-1, -2, -3])).toBe([-2]);
  });