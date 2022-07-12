

/**
 * 
 * @param hexString accepts string showing hex value
 * @returns  
 */
function hexStringToRGB(hexString : string) : typeof solution  {

  const decimal : string[] =  ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"]
  const hex : string[] =["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]

  const RGB : number[] = []

  interface solution {
    r: number
    g: number;
    b: number;
  }

  


  hexString = hexString.replace(/#/gi, '').toUpperCase()

  const red : string[] = hexString.substring(0,2).split("")
  const green : string[] = hexString.substring(2,4).split("")
  const blue : string[] = hexString.substring(4,6).split("")
  const colours  = [red,green,blue]

  colours.forEach(element =>{
    
    let firstValue : string = decimal[hex.indexOf(element[0])]
    //console.log(firstValue)
    let secondValue : string = decimal[hex.indexOf(element[1])]
    //console.log(secondValue)
    
    let result : number = Number(firstValue)*16 + Number(secondValue)
  
    RGB.push(result)
    
  })

  const solution : solution = {
    r: RGB[0],
    g: RGB[1],
    b: RGB[2]
  }

  console.log(solution)
  return solution

}

export default hexStringToRGB;