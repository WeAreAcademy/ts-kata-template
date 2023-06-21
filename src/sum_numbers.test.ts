import sumNumbers from "./sum_numbers";

test("Testing", () => {
  expect(sumNumbers(["old", 10, 20, "bond", -5, -3])).toBe(22);
  expect(sumNumbers(["old", "pond"])).toBe(0);
  expect(sumNumbers(["old", "pond", "1"])).toBe(0);
  expect(sumNumbers(["old", "pond", "1", 5])).toBe(5);
});

























