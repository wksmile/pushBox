import dataBus from '../dataBus'
import Background from '../background/index'
// 箱子的宽度
let boxWidth = dataBus.boxWeight

let box = {i:2,j:2}
let movationFlag = true;    // 运动是否结束

let image = wx.createImage()
image.src = 'images/people.png';
let imagebox = wx.createImage()
imagebox.src = 'images/box.png'

// 任务相关的动画
export default class Person {
  constructor(ctx,bg) {
    this.bg = bg
    this.ctx = ctx
    console.log(this.Posendx,this.Posendy)
    // this.end = this.boxWeight * (this.bg.person.x +1)  // 人物终点的x
    this.boxPosendx = boxWidth * 2              //  箱子开始的位置x
    this.boxPosendy = boxWidth * 2              // 箱子开始的位置y
  }

  // type运动的类型
  handleTouch(type,personX,personY) {
    this.Posendy = boxWidth * personX  // 人物开始的y
    this.Posendx = boxWidth * personY   // 人物开始的x
    if(movationFlag) {
      switch (type) {
        case 'left':
          this.endX = this.Posendx-boxWidth
          this.timer = window.requestAnimationFrame(
            this.loopLeft.bind(this)
          ); break;
        case 'right':
          this.endX = this.Posendx+boxWidth
          this.timer = window.requestAnimationFrame(
            this.loopRight.bind(this)
          ); break;
        case 'down':
          this.endY = this.Posendy+boxWidth
          this.timer = window.requestAnimationFrame(
            this.loopDown.bind(this)
          ); break;
        case 'up':
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
    this.bg.drawGameLevel("1",false,box)
    this.bg.drawButton()
    this.ctx.drawImage(image,this.Posendx,this.Posendy,boxWidth,boxWidth)   // 人物
  }
}
