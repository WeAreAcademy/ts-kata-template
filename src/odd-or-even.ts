/*

Given a list of integers, determine whether the sum of its elements is odd or even.

Give your answer as a string matching "odd" or "even".

If the input array is empty consider it as: [0] (array with a zero).

*/

/**
 * Given a list of integers, determine whether the sum of its elements is odd or even.
 *
 * @param numArr - input number array to sum
 * @returns - odd or even depending on sum value.
 */

function oddOrEven(numArr: number[]): string {
  return numArr.reduce((x, y) => x + y, 0) % 2 === 0 ? "even" : "odd";
}

export default oddOrEven;
