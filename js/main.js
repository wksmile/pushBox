import BackGround from './background/index'

let ctx  = canvas.getContext('2d')    // 上屏
let ctx2Canvas = wx.createCanvas()    // 离屏canvas
let ctx2 = ctx2Canvas.getContext('2d')   // 离屏
let xOffset = 630;
let clearInter;
let image,imagebox;
let actionButtonType // 按钮的类型
let box = {i:2,j:2}
let movationFlag = true;    // 运动是否结束
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.bg = new BackGround(ctx,ctx2,ctx2Canvas);
    this.reset();
    this.listenAction()
    this.boxWeight = this.bg.boxWeight    //  箱子的宽度
  }

  reset() {
    this.bg.drawBackground('#eee')
    this.bg.drawButtonBefore()
    this.bg.drawGame("1")
    // ctx2.fillStyle = 'pink'
    // ctx2.fillRect(10,10,30,30)
    // ctx.drawImage(ctx2Canvas,20,20)
    // console.log('odps',this.bg.person)
  }

  touchEventHandler(e){
    e.preventDefault()
    this.Posendy = this.boxWeight * this.bg.person.x   // 人物开始的y
    this.Posendx = this.boxWeight * this.bg.person.y   // 人物开始的x
    // this.end = this.boxWeight * (this.bg.person.x +1)  // 人物终点的x
    this.boxPosendx = this.boxWeight * 2              //  箱子开始的位置x
    this.boxPosendy = this.boxWeight * 2              // 箱子开始的位置y
    let x = e.touches[0].clientX   // 触摸点x
    let y = e.touches[0].clientY   // 触摸点y
    actionButtonType = this.bg.getTheAction(x,y)   // 触摸的方向键  返回left,right,down,up
    // console.log(actionButton)
    if(actionButtonType) {
      image = wx.createImage()
      image.src = 'images/people.png';
      imagebox = wx.createImage()
      imagebox.src = 'images/box.png'
      // 根据方向确定运动的轨迹
      // this.sureMovDirect(actionButtonType)
      switch (actionButtonType) {
        case 'left':
          this.endX = this.Posendx-this.boxWeight
          this.timer = window.requestAnimationFrame(
            this.loopLeft.bind(this)
          ); break;
        case 'right':
          this.endX = this.Posendx+this.boxWeight
          this.timer = window.requestAnimationFrame(
            this.loopRight.bind(this)
          ); break;
        case 'down':
          this.endY = this.Posendy+this.boxWeight
          this.timer = window.requestAnimationFrame(
            this.loopDown.bind(this)
          ); break;
        case 'up':
          this.endY = this.Posendy-this.boxWeight
          this.timer = window.requestAnimationFrame(
            this.loopUp.bind(this)
          ); break;
      }
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
    ctx.drawImage(imagebox,this.boxPosendx,this.boxPosendy,this.boxWeight,this.boxWeight)   // 箱子
  }
  // 人物的运动
  peopleMovation(type){
    this.sureMovDirect(type)
    ctx.drawImage(image,this.Posendx,this.Posendy,this.boxWeight,this.boxWeight)   // 人物
  }

  loop() {
    // console.log('------op',this.Posendx,this.Posendy,this.end)
    if(!movationFlag) {   // 运动未结束
      this.sureMovDirect(actionButtonType)
      this.update()
    } else {
      cancelAnimationFrame(this.timer);
    }
  }

  // 擦除，重汇按钮
  update() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    this.bg.drawGameLevel("1",false,box)
    this.bg.drawButton()
    ctx.drawImage(image,this.Posendx,this.Posendy,this.boxWeight,this.boxWeight)   // 人物
  }

  listenAction() {
    this.touchHandler = this.touchEventHandler.bind(this);
    canvas.addEventListener('touchstart', this.touchHandler)
  }
}
