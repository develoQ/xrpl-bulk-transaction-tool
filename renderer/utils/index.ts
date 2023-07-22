export const splitArrayByNum = <T>(arr:T[], num:number)=> {
  let tmpArr:T[][] = [];
  while (arr.length > 0) {
    tmpArr.push(arr.splice(0, num))
  }
  return tmpArr
}
