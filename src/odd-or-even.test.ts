import oddOrEven from "./odd-or-even";

test("Determine whether sum of the elements is odd or even", () => {
  expect(oddOrEven([4, 3])).toBe("odd");
  expect(oddOrEven([])).toBe("even");
  expect(oddOrEven([1, 2, 3])).toBe("even");
  expect(oddOrEven([-4, 3])).toBe("odd");
  expect(oddOrEven([-4, -2])).toBe("even");
});
