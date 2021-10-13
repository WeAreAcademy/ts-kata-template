import whoLikesIt from "./who-likes-it";

test("Determine whether sum of the elements is odd or even", () => {
  expect(whoLikesIt([])).toBe("No one likes this");
  expect(whoLikesIt(["Peter"])).toBe("Peter likes this");
  expect(whoLikesIt(["Jacob", "Alex"])).toBe("Jacob and Alex like this");
  expect(whoLikesIt(["Alex", "Jacob", "Mark"])).toBe(
    "Alex, Jacob and Mark like this",
  );
  expect(whoLikesIt(["Alex", "Jacob", "Mark", "Max"])).toBe(
    "Alex, Jacob and 2 others like this",
  );
  expect(whoLikesIt(["Alex", "Jacob", "Mark", "Max", "Jamie"])).toBe(
    "Alex, Jacob and 3 others like this",
  );
});
