import BackGround from './background/index'
import Person from './movation/person'

let ctx  = canvas.getContext('2d')    // 上屏
let actionButtonType // 按钮的类型
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.bg = new BackGround(ctx);
    this.person = new Person(ctx,this.bg);
    this.reset();
    this.listenAction()
    this.boxWeight = this.bg.boxWeight    //  箱子的宽度
  }

  reset() {
    this.bg.drawBackground('#eee')
    this.bg.drawButtonBefore()
    this.bg.drawGame("1")
  }

  touchEventHandler(e) {
    e.preventDefault()
    let x = e.touches[0].clientX   // 触摸点x
    let y = e.touches[0].clientY   // 触摸点y
    actionButtonType = this.bg.getTheAction(x, y)   // 触摸的方向键  返回left,right,down,up
    // console.log(actionButton)
    if (actionButtonType) {
      // 处理响应的运动
      this.person.handleTouch(actionButtonType,this.bg.person.x,this.bg.person.y)
      // 根据方向确定运动的轨迹
      // this.sureMovDirect(actionButtonType)
    }
  }

  listenAction() {
    this.touchHandler = this.touchEventHandler.bind(this);
    canvas.addEventListener('touchstart', this.touchHandler)
  }
}
