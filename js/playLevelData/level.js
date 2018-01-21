import {getDataBykey} from '../dataBus'
/* 0空  1墙   2箱子  3人  4 点  8 到达 */
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
// 改变箱子位置关卡地图，并判断游戏是否结束
// key 关卡， position 改变的位置  value改变的值  origX原来的x坐标    origY原来的Y坐标
export function changePlayLevelData(key, position, value,originPos=position) {
  // 说明是箱子移动了，这里需要判断是否移到了点上或者是从点上移出来了
  if(value ===2) {
    // 获取移动点前一个点的坐标位置标志物
    let originItem = level[key][originPos.x][originPos.y]
    // 获取移动点需要替换位置的标志物
    let willItem = level[key][position.x][position.y]
    // 如果从空白或者人物之前的位置移到点上,说明该箱子到达位置，应该设置到达的标志物
    if((originItem===0 || originItem === 3)&&willItem ===4) {
      level[key][position.x][position.y] = 8
    } else if(originItem===4 && willItem===4){    // 箱子从点移动到点上，将之前位置变成点，将来的位置变成到达
      level[key][originPos.x][originPos.y] = 4
      level[key][position.x][position.y] = 8
    } else if(originItem===4 && willItem===0){  // 箱子从点移动到空白，应该设置原来的为点，将来设为箱子
      level[key][originPos.x][originPos.y] = 4
      level[key][position.x][position.y] = 2
    }
  } else {
    level[key][position.x][position.y] = value
  }
}
// 判断人物对应的方向是什么物
// cus 游戏关卡 | positon 人物的位置{x:,y:}   direct  移动的方向(left,right,up,down)
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
    // 尝试获取位置，如果获取不到说明超出了地图
  item = gameLevel[copyY][copyX]
    // 超出地图，不能移动
  // 反向位置为空白
  if(item === 0) return 0;
  // 返回的是墙
  else if(item === 1) return 1;
  // 返回的是箱子，还得继续判断箱子是否能够移动
  else if(item === 2) {
    // 如果箱子也可以移动
    if(isCouldPersonMove(cus, {x:copyX, y:copyY}, direct)) return 5;
    // 箱子不能移动
    else return 6
  }
  // 返回3应该是返回了原点，走了后为空
  else if(item === 3) return 3;
  // 返回的点
  else if(item === 4) return 4;
  // 超出范围了
  return -1;
}

// 判断人物是否能够向某个方向移动  cus 关卡  position 人物位置信息   direct 反向
export function isCouldPersonMove(cus, position, direct) {
  let item = directItemByPerson(cus, position, direct);
  console.log('item',item)
  /* 0空  1墙   2箱子  3人  4 点 */
  if(item === 0 || item === 4 || item === 3) return true
  else {
    return false
  }
}
