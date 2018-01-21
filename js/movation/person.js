import {getDataBykey,changeData} from '../dataBus'
import {changePlayLevelData,getPlayLevelData,isCouldPersonMove,directItemByPerson} from '../playLevelData/level'
// 箱子的宽度
let boxWidth = getDataBykey('boxWeight')

// let box = {i:2,j:2}
let movationFlag = true;    // 运动是否结束
// 人物图片
let image = wx.createImage()
image.src = 'images/people.png';
// 箱子图片
let imagebox = wx.createImage()
imagebox.src = 'images/box.png'
// 箱子是否应该移动true表示箱子也方向移动，false表示不移动
let isMoveBox = false;
// 任务相关的动画
export default class Person {
  constructor(ctx,bg) {
    this.bg = bg
    this.ctx = ctx
    // console.log(this.Posendx,this.Posendy)
    // this.end = this.boxWeight * (this.bg.person.x +1)  // 人物终点的x
    //this.boxPosendx = boxWidth * 2              //  箱子开始的位置x
    //this.boxPosendy = boxWidth * 2              // 箱子开始的位置y
  }

  // type运动的类型
  handleTouch(type) {
    // 动画还未结束
    if(!movationFlag) return;
    // 人物开始的位置
    let position = getDataBykey('personPosition')
    // 箱子是否应该移动true表示箱子也方向移动，false表示不移动
    isMoveBox = false
    console.log('posistion',position)
    this.personX = position.x;
    this.personY = position.y;
    this.Posendy = boxWidth * this.personY  // 人物开始的y像素
    this.Posendx = boxWidth * this.personX   // 人物开始的x像素
    console.log(this.Posendx,this.Posendy)
    // 根据人物移动方向上的位置返回方向物品
    let isMove;
    switch (type) {
      case 'left':
        isMove = directItemByPerson("1",position,"left");
        // -1 超出范围  1 墙    6 箱子且箱子不能移动
        if(isMove === -1 || isMove === 1 || isMove === 6) return;
        console.log('ismove',isMove)
        // 5 说明方向上的箱子也能移动，应该触发箱子移动,标志箱子可以移动
        if(isMove === 5) {
          isMoveBox = true;
          // 箱子的初始位置
          this.Boxx = this.personX -1;
          this.Boxy = this.personY;
          this.Posboxx = boxWidth * this.Boxx;  // 箱子开始的位置
          this.Posboxy = boxWidth * this.Boxy;
          console.log('boxPosition',this.Boxx,this.Boxy)
        }
        this.endX = this.Posendx-boxWidth
        this.timer = window.requestAnimationFrame(
          this.loopLeft.bind(this)
        ); break;
      case 'right':
        isMove = directItemByPerson("1",position,"right");
        if(isMove === -1 || isMove === 1 || isMove === 6) return;
        if(isMove === 5) {
          isMoveBox = true;
          this.Boxx = this.personX + 1;
          this.Boxy = this.personY;
          this.Posboxx = boxWidth * this.Boxx;  // 箱子开始的位置
          this.Posboxy = boxWidth * this.Boxy;
          console.log('boxPosition',this.Boxx,this.Boxy)
        }
        this.endX = this.Posendx+boxWidth
        this.timer = window.requestAnimationFrame(
          this.loopRight.bind(this)
        ); break;
      case 'down':
        isMove = directItemByPerson("1",position,"down");
        if(isMove === -1 || isMove === 1 || isMove === 6) return;
        if(isMove === 5) {
          isMoveBox = true;
          this.Boxx = this.personX;
          this.Boxy = this.personY+1;
          this.Posboxx = boxWidth * this.Boxx;  // 箱子开始的位置
          this.Posboxy = boxWidth * this.Boxy;
          console.log('boxPosition',this.Boxx,this.Boxy)
        }
        this.endY = this.Posendy+boxWidth
        this.timer = window.requestAnimationFrame(
          this.loopDown.bind(this)
        ); break;
      case 'up':
        isMove = directItemByPerson("1",position,"up");
        if(isMove === -1 || isMove === 1 || isMove === 6) return;
        if(isMove === 5) {
          isMoveBox = true;
          this.Boxx = this.personX;
          this.Boxy = this.personY-1;
          this.Posboxx = boxWidth * this.Boxx;  // 箱子开始的位置
          this.Posboxy = boxWidth * this.Boxy;
          console.log('boxPosition',this.Boxx,this.Boxy)
        }
        this.endY = this.Posendy-boxWidth
        this.timer = window.requestAnimationFrame(
          this.loopUp.bind(this)
        ); break;
    }
      movationFlag = false
  }

  loopLeft(){
    console.log('move left----')
    if(this.Posendx > this.endX) {
      // 箱子也移动
      if(isMoveBox) {
        this.Posboxx--
      }
      this.Posendx--
      this.update()
      this.updateLeft()
    } else {
      cancelAnimationFrame(this.timer);
      movationFlag = true
      // changePlayLevelData("1",{x:this.personX,y:this.personY},0)
      // changePlayLevelData("1",{x: --this.personX,y:this.personY},3)
      changeData('personPosition',{x:--this.personX,y:this.personY})
      if(isMoveBox) {
        changePlayLevelData("1",{y:this.Boxx,x:this.Boxy},0)
        changePlayLevelData("1",{y:--this.Boxx,x:this.Boxy},2,{y:this.Boxx,x:this.Boxy})
      }
      // 改变levelData中游戏地图，保存箱子移动后的距离
      console.log('youyouqiekela',this.personX,this.personY)
    }
  }

  updateLeft(){
    this.timer = window.requestAnimationFrame(
      this.loopLeft.bind(this)
    )
  }

  loopRight(){
    console.log('move right----')
    if(this.Posendx < this.endX) {
      if(isMoveBox) {
        this.Posboxx++
      }
      this.Posendx++
      this.update()
      this.updateRight()
    } else {
      cancelAnimationFrame(this.timer);
      movationFlag = true
      // 更新了游戏数据列表
      //changePlayLevelData("1",{x:this.personX,y:this.personY},0)
      //changePlayLevelData("1",{x: ++this.personX,y:this.personY},3)
      changeData('personPosition',{x:++this.personX,y:this.personY})
      if(isMoveBox) {
        changePlayLevelData("1",{y:this.Boxx,x:this.Boxy},0)
        changePlayLevelData("1",{y:++this.Boxx,x:this.Boxy},2,{y:this.Boxx,x:this.Boxy})
      }
      console.log('youyouqiekela',this.personX,this.personY)
      // 再绘制一次，更新人物的位置，并绘制了人物终点的位置
      // this.ctx.clearRect(0,0,canvas.width,canvas.height)
      // this.bg.drawGameLevel("1",true)
      console.log(getPlayLevelData('1'))
    }
  }

  updateRight(){
    this.timer = window.requestAnimationFrame(
      this.loopRight.bind(this)
    )
  }

  loopDown(){
    console.log('move down----')
    if(this.Posendy < this.endY) {
      if(isMoveBox) {
        this.Posboxy++
      }
      this.Posendy++
      this.update()
      this.updateDown()
    } else {
      cancelAnimationFrame(this.timer);
      movationFlag = true
      // changePlayLevelData("1",{x:this.personX,y:this.personY},0)
      // changePlayLevelData("1",{x: this.personX,y:++this.personY},3)
      changeData('personPosition',{x:this.personX,y:++this.personY})
      if(isMoveBox) {
        changePlayLevelData("1",{y:this.Boxx,x:this.Boxy},0)
        changePlayLevelData("1",{y:this.Boxx,x:++this.Boxy},2,{y:this.Boxx,x:this.Boxy})
      }
      console.log('youyouqiekela',this.personX,this.personY)
      console.log(getPlayLevelData('1')[2][3])
    }
  }

  updateDown(){
    this.timer = window.requestAnimationFrame(
      this.loopDown.bind(this)
    )
  }

  loopUp(){
    console.log('move up----')
    if(this.Posendy > this.endY) {
      if(isMoveBox) {
        this.Posboxy--
      }
      this.Posendy--
      this.update()
      this.updateUp()
    } else {
      cancelAnimationFrame(this.timer);
      movationFlag = true
      // 把之前的位置设置为空
      // changePlayLevelData("1",{x:this.personX,y:this.personY},0)
      // // 把接下来的位置设置为小人
      // changePlayLevelData("1",{x: this.personX,y:--this.personY},3)
      // 改变databus中person的信息
      changeData('personPosition',{x:this.personX,y:--this.personY})
      if(isMoveBox) {
        changePlayLevelData("1",{y:this.Boxx,x:this.Boxy},0)
        changePlayLevelData("1",{y:this.Boxx,x:--this.Boxy},2,{y:this.Boxx,x:this.Boxy})
      }
      console.log('youyouqiekela',this.personX,this.personY)
    }
  }

  updateUp(){
    this.timer = window.requestAnimationFrame(
      this.loopUp.bind(this)
    )
  }

  sureMovDirect(type) {
    switch (type) {
      case 'left':
        this.Posendx--;break;
      case 'right':
        this.Posendx++;break;
      case 'down':
        this.Posendy++;break;
      case 'up':
        this.Posendy--;break
    }
  }
  // 箱子的运动
  boxMovation(type) {
    this.sureMovDirect(type)
    this.ctx.drawImage(imagebox, this.boxPosendx, this.boxPosendy, boxWidth, boxWidth)   // 箱子
  }

  // 擦除，重汇按钮
  update() {
    this.ctx.clearRect(0,0,canvas.width,canvas.height)
    this.bg.drawBackground('#eee')
    // false不会绘制人物的位置，人物由上面自动控制
    this.bg.drawGameLevel("1",false)
    this.bg.drawButton()
    // 绘制人物，绘制人物的位置
    this.ctx.drawImage(image,this.Posendx,this.Posendy,boxWidth,boxWidth)   // 人物
    if(isMoveBox) this.ctx.drawImage(imagebox,this.Posboxx,this.Posboxy,boxWidth,boxWidth)   // 箱子
  }
}
