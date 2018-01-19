import {getDataBykey,changeData} from '../dataBus'
import {changePlayLevelData,getPlayLevelData,isCouldPersonMove} from '../playLevelData/level'
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
    // 人物开始的位置
    let position = getDataBykey('personPosition')
    console.log('posistion',position)
    this.personX = position.x;
    this.personY = position.y;
    this.Posendy = boxWidth * this.personY  // 人物开始的y像素
    this.Posendx = boxWidth * this.personX   // 人物开始的x像素
    console.log(this.Posendx,this.Posendy)
    if(movationFlag) {
      switch (type) {
        case 'left':
          if(!isCouldPersonMove("1",position,"left")) return;
          this.endX = this.Posendx-boxWidth
          this.timer = window.requestAnimationFrame(
            this.loopLeft.bind(this)
          ); break;
        case 'right':
          if(!isCouldPersonMove("1",position,"right")) return;
          this.endX = this.Posendx+boxWidth
          this.timer = window.requestAnimationFrame(
            this.loopRight.bind(this)
          ); break;
        case 'down':
          if(!isCouldPersonMove("1",position,"down")) return;
          this.endY = this.Posendy+boxWidth
          this.timer = window.requestAnimationFrame(
            this.loopDown.bind(this)
          ); break;
        case 'up':
          if(!isCouldPersonMove("1",position,"up")) return;
          this.endY = this.Posendy-boxWidth
          this.timer = window.requestAnimationFrame(
            this.loopUp.bind(this)
          ); break;
      }
      movationFlag = false
    }
  }

  loopLeft(){
    console.log('move left----')
    if(this.Posendx > this.endX) {
      this.Posendx--
      this.update()
      this.updateLeft()
    } else {
      cancelAnimationFrame(this.timer);
      movationFlag = true
      // changePlayLevelData("1",{x:this.personX,y:this.personY},0)
      // changePlayLevelData("1",{x: --this.personX,y:this.personY},3)
      changeData('personPosition',{x:--this.personX,y:this.personY})
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
      this.update()
      this.Posendx++
      this.updateRight()
    } else {
      cancelAnimationFrame(this.timer);
      movationFlag = true
      // 更新了游戏数据列表
      //changePlayLevelData("1",{x:this.personX,y:this.personY},0)
      //changePlayLevelData("1",{x: ++this.personX,y:this.personY},3)
      changeData('personPosition',{x:++this.personX,y:this.personY})
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
      this.update()
      this.Posendy++
      this.updateDown()
    } else {
      cancelAnimationFrame(this.timer);
      movationFlag = true
      // changePlayLevelData("1",{x:this.personX,y:this.personY},0)
      // changePlayLevelData("1",{x: this.personX,y:++this.personY},3)
      changeData('personPosition',{x:this.personX,y:++this.personY})
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
      this.update()
      this.Posendy--
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
    // false不会绘制人物的位置，人物由上面自动控制
    this.bg.drawGameLevel("1",false)
    this.bg.drawButton()
    // 绘制人物，绘制人物的位置
    this.ctx.drawImage(image,this.Posendx,this.Posendy,boxWidth,boxWidth)   // 人物
  }
}
