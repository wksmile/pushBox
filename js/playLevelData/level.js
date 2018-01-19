/* 0空  1墙   2箱子  3人  4 点 */
const level = {
  "1":[
    [0,1,1,1,1,0],
    [1,4,0,0,1,0],
    [3,0,2,0,1,0],
    [2,1,2,0,1,1],
    [1,1,0,2,0,1],
    [1,4,2,0,0,1],
    [1,4,4,2,4,1],
    [1,1,1,1,1,1]
  ]
}
// 获取关卡数据
export function getPlayLevelData(key) {
  return level[key]
}
// 改变关卡地图
export function changePlayLevelData(key, position, value) {
  level[key][position.x][position.y] = value
}
// 判断人物对应的方向是什么物
// cus 游戏关卡 | positon 人物的位置{x:,y:}   direct  移动的方向（left,right,up,down）
// 返回方向上的物
export function directItemByPerson(cus, position, direct) {
  let gameLevel = level[cus];
  let copyX = position.x, copyY = position.y;
  console.log('copy',copyX,copyY)
  switch (direct) {
    case 'left':
      --copyX; break;
    case 'right':
      ++copyX; break;
    case 'up':
      --copyY; break;
    case 'down':
      ++copyY; break;
  }
  // 获取位置的数字
  let item;
  try{
    // 尝试获取位置，如果获取不到说明超出了地图
    item = gameLevel[copyY][copyX]
    console.log('getItem',copyX,copyY,item)
  } catch (e) {
    // 超出地图，不能移动
    return -1
  }
  // 反向位置为空白
  if(item === 0) return 0;
  else if(item === 1) return 1;
  else if(item === 2) return 2;
  // 返回3应该是返回了原点，走了后为空
  else if(item === 3) return 3;
  else if(item === 4) return 4;
}

// 判断人物是否能够向某个方向移动  cus 关卡  position 人物位置信息   direct 反向
export function isCouldPersonMove(cus, position, direct) {
  let item = directItemByPerson(cus, position, direct);
  console.log('item',item)
  if(item === 0 || item === 4 || item === 3) return true
  else {
    return false
  }
}
