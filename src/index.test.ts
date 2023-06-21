import calcAveragesNegativeAndPositive from "./index";

test("Average Positives, negatives and zeros", () => {
    expect(calcAveragesNegativeAndPositive([])).toStrictEqual([null, null]);
    expect(calcAveragesNegativeAndPositive([1, 2, 3, -1, -2, -3])).toStrictEqual([2, -2]);
    expect(calcAveragesNegativeAndPositive([1, 2, 3, 0 ,-1, -2, -3])).toStrictEqual([2, -2]);
    expect(calcAveragesNegativeAndPositive([0, 0, 0, 0])).toStrictEqual([null, null]);
    expect(calcAveragesNegativeAndPositive([1, 2, 3])).toStrictEqual([2, null]);
    //expect(calcAveragesNegativeAndPositive([1, 2, 3])).toStrictEqual([2]);
    expect(calcAveragesNegativeAndPositive([-1, -2, -3])).toStrictEqual([null, -2]);
    //expect(calcAveragesNegativeAndPositive([-1, -2, -3])).toStrictEqual([-2]);
  });