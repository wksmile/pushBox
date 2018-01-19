import {getPlayLevelData} from '../playLevelData/level'
import {loadImg} from '../utils/index'
// 改变数据
import {changeData,getDataBykey} from '../dataBus'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

var boxWeight = screenWidth/6

// 全局共享元素块的宽度
changeData('boxWeight',boxWeight)

// 人物图片
let personImgPromise = loadImg('images/people.png'),
// 箱子图片
boxImgPromise = loadImg('images/box.png'),
// 墙图片
wallImgPromise = loadImg('images/wall.png'),
// 点
dfImgPromise = loadImg('images/df.png'),
  // 方向按钮图片
downImgPromise = loadImg('images/cc-arrow-circle-down.png'),
leftImgPromise = loadImg('images/cc-arrow-circle-left.png'),
rightImgPromise = loadImg('images/cc-arrow-circle-right.png'),
upImgPromise = loadImg('images/cc-arrow-circle-up.png')

let personImg,boxImg,wallImg,dfImg;
let downImg,leftImg,rightImg,upImg;

export default class BackDraw {
  constructor(ctx) {
    this.ctx = ctx;          //  上屏
    // this.person = null;
    this.boxWeight = boxWeight
  }
  // 绘制背景颜色，背景大小
  drawBackground(color,width=screenWidth,height=screenHeight) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0,0,width,height);
    this.ctx.fill();
  }

  // 绘制图片
  /* 0 空  1 墙    2 箱子    3 人    4 点 */
  drawImg (type,imgStartX,imgStartY) {
    // var image = wx.createImage();
    // image.onload = () => {
    //   // console.log(imgStartX, imgStartY)
    //   if(type == 1 || type == 4) {
    //     this.ctx.drawImage(image, imgStartX, imgStartY,boxWeight,boxWeight)
    //   } else {
    //     this.ctx2.drawImage(image, imgStartX, imgStartY,boxWeight,boxWeight)
    //     this.ctx.drawImage(this.ctx2Canvas,0,0)
    //   }
    // }
    // image.src = source;
    // console.log('typeimg',type,imgStartY,imgStartY)
    let image;
    switch (type) {
      case 1:
        image = wallImg; break;
      case 2:
        image = boxImg; break;
      case 3:
        image = personImg; break;
      case 4:
        image = dfImg; break;
      default:
        image = null
    }
    if(image) {
      // console.log(image)
        this.ctx.drawImage(image, imgStartX, imgStartY,boxWeight,boxWeight)
    }
  }
  // 加载完显示的图片后绘制游戏界面
  drawGame(level,isFirstDraw=true){
    if(!personImg) {
      Promise.all([personImgPromise,boxImgPromise,wallImgPromise,dfImgPromise]).then(([person, box, wall, df]) => {
        personImg = person;
        boxImg = box;
        wallImg = wall;
        dfImg = df
        this.drawGameLevel(level,isFirstDraw)
      })
    } else {
      this.drawGameLevel(level,isFirstDraw)
    }
  }

  // 根据关卡地图绘制游戏关卡  isFirstDraw是否是第一次加载
  drawGameLevel(level,isFirstDraw=true){
    let levelData = getPlayLevelData(level)
    // console.log(levelData)
    for (let i=0;i<levelData.length;i++){
      for(let j=0;j<levelData[0].length;j++){
        let imgX = boxWeight * i;
        let imgY = boxWeight * j;
        // 只有第一次才会绘制人物，true表示是第一次
        if(levelData[i][j] === 3 && !isFirstDraw) continue;
        //  第一次运行才会去得到人物的位置，就是只会执行一次
        if(levelData[i][j] === 3)  changeData('personPosition',{x:j,y:i})
        // if(box && box.i == i && box.j ==j) continue;          // 移动的箱子不绘制
        // console.log('levelData-----',levelData[i][j],imgStartX,imgStartY)
        // let source = this.loadImgByType(levelData[i][j])
        // 图片类型  原文件url  图片开始的横坐标   图片开始的纵坐标
        this.drawImg(levelData[i][j],imgY, imgX);
      }
    }
  }
  // 加载完绘制操作按钮
  drawButtonBefore(){
    if(!downImg) {
      Promise.all([downImgPromise,leftImgPromise,rightImgPromise,upImgPromise]).then(([down, left, right, up]) => {
        downImg = down;
        leftImg = left;
        rightImg = right;
        upImg = up;
        this.drawButton()
      })
    } else {
      this.drawButton()
    }
  }

  // 绘制操作按钮
  drawButton() {
    let middle = screenWidth / 2
    // let src = ''
    let image;
    let startX = 0,startY = 0
    let buttonLabel = ['down','left','right','up']
    for (let i in buttonLabel) {
      switch(buttonLabel[i]){
        case 'down':
           //src = 'images/cc-arrow-circle-down.png';
           image = downImg
           startX = middle - boxWeight/2
           startY = screenHeight - boxWeight -10
           break;
        case 'left':
          //src = 'images/cc-arrow-circle-left.png';
          image = leftImg
          startX = middle - boxWeight/2 * 3
          startY = screenHeight - boxWeight*2 - 10
          break;
        case 'right':
          //src = 'images/cc-arrow-circle-right.png';
          image = rightImg
          startX = middle + boxWeight/2
          startY = screenHeight - boxWeight*2 - 10
          break;
        case 'up':
          //src = 'images/cc-arrow-circle-up.png';
          image = upImg
          startX = middle - boxWeight/2
          startY = screenHeight - boxWeight*3 - 10
          break;
      }
      // console.log('----OOOOO',src,startX,startY)
      this.ctx.drawImage(image,startX,startY)
    }
    // 设置按钮的位置
    this.btnArea = {
      left: {
        startX: middle - boxWeight/2 * 3,
        startY: screenHeight - boxWeight*2 - 10,
        endX: middle - boxWeight/2,
        endY: screenHeight - boxWeight - 10,
      },
      right: {
        startX: middle + boxWeight/2,
        startY: screenHeight - boxWeight*2 - 10,
        endX: middle + boxWeight/2 * 3,
        endY: screenHeight - boxWeight - 10,
      },
      up: {
        startX: middle - boxWeight/2,
        startY: screenHeight - boxWeight*3 - 10,
        endX: middle + boxWeight/2,
        endY: screenHeight - boxWeight*2 - 10,
      },
      down: {
        startX: middle - boxWeight/2,
        startY: screenHeight - boxWeight -10,
        endX: middle + boxWeight/2,
        endY: screenHeight - 10,
      }
    }
  }
  // 根据触摸的位置返回对应的按键名称
  getTheAction(x,y){
    // console.log('buttonArea',this.btnArea)
    let leftArea = this.btnArea.left,
        rightArea = this.btnArea.right,
        upArea = this.btnArea.up,
        downArea = this.btnArea.down;
    if(x>leftArea.startX && x<rightArea.endX && y>upArea.startY && y<downArea.endY) {
      // console.log(x,y)
      if(y<leftArea.endY && y>leftArea.startY){
        // console.log('-------',x,y);
        if(x<leftArea.endX) return 'left'
        if(x>rightArea.startX) return 'right'
      }
      if(x>upArea.startX && x<upArea.endX) {
        // console.log('+++++++',x,y);
        if(y>downArea.startY) return 'down'
        if(y<upArea.endY) return 'up'
      }
    }
  }
}
