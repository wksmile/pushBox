import DataBus    from './databus'
import BackGround from './background/index'

let ctx   = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.bg = new BackGround(ctx);

    this.reset();
  }

  reset() {
    this.bg.drawBackground('#bbb',300,500)
  }
}
