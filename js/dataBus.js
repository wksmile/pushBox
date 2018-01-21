// 全局状态管理
const busData = {
  personPosition:{
    x: null,
    y: null
  },
  // 元素每一块的宽度
  boxWeight: 0,
  // 箱子的总数
  boxNum: 0
}
// 改变数据
export function changeData(key, value) {
  busData[key] = value
}

// 获取数据
export function getDataBykey(key) {
  return busData[key]
}
