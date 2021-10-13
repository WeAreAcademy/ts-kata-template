/*
You probably know the "like" system from Facebook and other pages. People can "like" blog posts, pictures or other items. We want to create the text that should be displayed next to such an item.

Implement the function which takes an array containing the names of people that like an item. It must return the display text as shown in the examples:

[]                                -->  "No one likes this"
["Peter"]                         -->  "Peter likes this"
["Jacob", "Alex"]                 -->  "Jacob and Alex like this"
["Max", "John", "Mark"]           -->  "Max, John and Mark like this"
["Alex", "Jacob", "Mark", "Max"]  -->  "Alex, Jacob and 2 others like this"

Note: For 4 or more names, the number in "and 2 others" simply increases.
*/

/**
 * Implement the function which takes an array containing the names of people that like an item and return a string to show
 * who has liked it
 *
 * @param strArr - input array containing names
 * @returns - string to represent who has liked it.
 */

function whoLikesIt(strArr: string[]): string {
  switch (strArr.length) {
    case 0:
      return "No one likes this";
    case 1:
      return `${strArr[0]} likes this`;
    case 2:
      return `${strArr[0]} and ${strArr[1]} like this`;
    case 3:
      return `${strArr[0]}, ${strArr[1]} and ${strArr[2]} like this`;
    default:
      return `${strArr[0]}, ${strArr[1]} and ${
        strArr.length - 2
      } others like this`;
  }
}

export default whoLikesIt;
