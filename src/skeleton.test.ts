import hexStringToRGB from "./skeleton";

test("sum adds two numbers", () => {
  expect(hexStringToRGB("#FF9933")).toBe({ r: 255, g: 153, b: 51 });
});
