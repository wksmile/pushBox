export default class BackDraw {
  constructor(ctx) {
    this.ctx = ctx;
  }
  // 绘制背景颜色，背景大小
  drawBackground(color,width,height) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(25,25,25+width,25+height);
    this.ctx.fill();
  }
  // 绘制图片
  drawImg() {
    var image = wx.createImage();
    image.onload = function () {
      console.log(image.width, image.height)
      this.ctx.drawImage(image, 0, 0)
    }
    image.src = 'images/people.png'
  }
}
