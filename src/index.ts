
function calcAveragesNegativeAndPositive(inputArr: number[]): (number | null)[] {
    const posArr: number[] = inputArr.filter(item => item > 0);
    const negArr: number[] = inputArr.filter(item => item < 0);
    
    const posAvg: number | null = calcAverage(posArr); 
    const negAvg: number | null = calcAverage(negArr); 
    return [posAvg, negAvg];
}

function calcAverage(avgArr: number[]): number | null {
    if (avgArr.length === 0){
        return null;
    }
    return avgArr.reduce((acc, item) => item + acc, 0) / avgArr.length;
}

console.log(calcAveragesNegativeAndPositive([]));

export default calcAveragesNegativeAndPositive