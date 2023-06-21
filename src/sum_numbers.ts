//Return the total SUM of all numbers in an array of numbers and strings.  Use array functions, not a loop. (TypeScript)


//countStrings([**”old”**, 10, 20, **“pond”**, -5, -3]) should return 22

//let numberArr: number[] = inputArr.map(item => typeof item === 'number' ? return item : null);

function sumNumbers(inputArr: (number | string)[]): number {
  let tempArrinputArr: any[] = inputArr.filter(item => typeof item === 'number');
  let numberArr: number[] = tempArrinputArr;

  return numberArr.reduce((acc, item) => acc + item, 0);
}

//console.log(sumNumbers(["old", 10, 20, "bond", -5, -3]));

export default sumNumbers;