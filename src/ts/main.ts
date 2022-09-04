// spine
import * as spine from '@esotericsoftware/spine-webgl'
// module
import { SpineApp } from './modules/spineApp/spineApp'

window.onload = () => {
  // canvas要素
  const canvas = document.querySelector('.js-canvas') as HTMLCanvasElement
  // canvas 要素と SpineApp インスタンスを紐付ける
  new spine.SpineCanvas(canvas, {
    pathPrefix: 'assets/spine-data/',
    app: new SpineApp()
  })
}
