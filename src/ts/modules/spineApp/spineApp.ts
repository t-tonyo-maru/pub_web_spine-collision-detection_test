import * as spine from '@esotericsoftware/spine-webgl'
import { SkeletonBounds } from '@esotericsoftware/spine-core'

export class SpineApp implements spine.SpineCanvasApp {
  private skeleton: unknown // type: spine.Skeleton
  private state: unknown // type: spine.AnimationState
  private pixelRatio: number = window.devicePixelRatio || 1
  private aspectRatio: number = 0

  loadAssets = (canvas: spine.SpineCanvas) => {
    // atlasファイルをロード
    canvas.assetManager.loadTextureAtlas('model.atlas')
    // skeletonをロード
    canvas.assetManager.loadJson('model.json')
  }

  initialize = (canvas: spine.SpineCanvas) => {
    // spine アセットマネージャーを取得
    const assetManager = canvas.assetManager

    // テクスチャアトラスを生成
    const atlas = canvas.assetManager.require('model.atlas')
    // AtlasAttachmentLoader インスタンスを生成
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
    // skeletonを読み込むためのオブジェクトを生成
    const skeltonJson = new spine.SkeletonJson(atlasLoader)
    // skeleton情報を読み込み
    const skeltonData = skeltonJson.readSkeletonData(
      assetManager.require('model.json')
    )
    // skeletonインスタンスを生成してメンバにセット
    this.skeleton = new spine.Skeleton(skeltonData)

    if (!(this.skeleton instanceof spine.Skeleton)) return
    // canvas.gl.drawingBufferWidth // 150
    // this.skeleton.data.width // 434.38

    // アスペクト比を更新
    this.aspectRatio = this.skeleton.data.height / this.skeleton.data.width

    // console.log(this.aspectRatio)
    console.log(canvas)

    // skeletonの大きさをセット
    this.skeleton.scaleX = 0.2
    // (canvas.gl.drawingBufferWidth * 0.8) / this.skeleton.data.width
    this.skeleton.scaleY = 0.2
    // this.skeleton.scaleY =
    //   ((canvas.gl.drawingBufferWidth * 0.6) / this.skeleton.data.width) *
    //   this.aspectRatio

    console.log(this.skeleton)
    // console.log(canvas.gl.drawingBufferHeight)
    // console.log(this.pixelRatio)

    // skeletonの位置をセット
    this.skeleton.x = 0 // canvas.gl.drawingBufferWidth / 2
    this.skeleton.y = 0 // (-1 * Math.floor(this.skeleton.data.height / this.pixelRatio)) / 2

    // アニメーション情報を取得
    const stateData = new spine.AnimationStateData(skeltonData)
    // デフォルトのMixをセット
    stateData.defaultMix = 0.1
    // アニメーションをセット
    this.state = new spine.AnimationState(stateData)
    if (!(this.state instanceof spine.AnimationState)) return
    this.state.setAnimation(0, 'animation', true)

    this.state.apply(this.skeleton)
    this.skeleton.updateWorldTransform()

    // console.log(this.skeleton)
    // console.log(SkeletonBounds)
    canvas.input.addListener({
      down: (x, y) => {
        if (!(this.skeleton instanceof spine.Skeleton)) return
        // console.log(this.skeleton.getBoundsRect())
        // const offset = new spine.Vector2(),
        //   size = new spine.Vector2()
        // console.log(this.skeleton.getBounds(offset, size))
        // console.log('down Event', x, y)

        // const skelBounds = this.skeleton.data
        // console.log(this.skeleton)

        const skelBounds = new SkeletonBounds()
        skelBounds.update(this.skeleton, true)

        console.log(skelBounds)
        // console.log(x, y)

        // console.log(skelBounds.containsPoint(x, y))
        if (
          skelBounds.containsPoint(
            x - canvas.gl.drawingBufferWidth / 2,
            y - (canvas.gl.drawingBufferHeight / 2) + (this.skeleton.data.height * this.skeleton.scaleY)
          )
        ) {
          console.log('click')
        } else {
          console.log('not click')
        }
      }
    })
  }

  update = (canvas: spine.SpineCanvas, delta: number) => {
    if (!(this.skeleton instanceof spine.Skeleton)) return
    if (!(this.state instanceof spine.AnimationState)) return

    // アニメーションを更新
    this.state.update(delta)
    this.state.apply(this.skeleton)
    this.skeleton.updateWorldTransform()
  }

  render = (canvas: spine.SpineCanvas) => {
    if (!(this.skeleton instanceof spine.Skeleton)) return

    // レンダラーを取得
    const renderer = canvas.renderer
    // 画面リサイズ（ブラウザサイズが変更された時の対応）
    renderer.resize(spine.ResizeMode.Expand)
    // 画面クリア
    canvas.clear(0.2, 0.2, 0.2, 1)
    // 描画開始
    renderer.begin()
    // skeleton を描画
    renderer.drawSkeleton(this.skeleton)
    // 描画終了
    renderer.end()
  }

  error = (canvas: spine.SpineCanvas) => {
    console.log('error!!')
    console.log(canvas)
  }
}
