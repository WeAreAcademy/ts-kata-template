import hexStringToRGB from "./skeleton";

test("converts a hex string to RGB key value pairs", () => {
  expect(hexStringToRGB("#FF9933")).toEqual({ r: 255, g: 153, b: 51 });
  expect(hexStringToRGB("E5FFCC")).toEqual({ r: 229, g: 255, b: 204 });
  //expect(hexStringToRGB("#FF9933")).toEqual({ r: 255, g: 153, b: 51 });
  //expect(hexStringToRGB("#FF9933")).toEqual({ r: 255, g: 153, b: 51 });
});
