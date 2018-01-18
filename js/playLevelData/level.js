/* 0 空
  1 墙
  2 箱子
  3 人
  4 点
*/
const level = {
  "1":[
    [0,1,1,1,1,0],
    [1,1,0,0,1,0],
    [1,3,2,0,1,0],
    [1,1,2,0,1,1],
    [1,1,0,2,0,1],
    [1,4,2,0,0,1],
    [1,4,4,2,4,1],
    [1,1,1,1,1,1]
  ]
}

export default function getPlayLevelData(key) {
  return level[key]
}
