export function loadImg(src) {
  let image = wx.createImage()
  return new Promise((resolve,reject)=>{
    image.onload = ()=>{
      resolve(image)
    }
    image.onerror = (err)=> {
      reject(err)
    }
    image.src = src;
  })
}
