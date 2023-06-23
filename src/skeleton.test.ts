import sum from "./skeleton";

test("sum adds two numbers", () => {
  expect(sum(4, 3)).toBe(7);
});


test("sum adds two numbers cancelling", () => {
  expect(sum(-4, 4)).toBe(0);
});
