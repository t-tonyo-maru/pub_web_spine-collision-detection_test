import * as spine from '@esotericsoftware/spine-webgl'
import { SkeletonBounds } from '@esotericsoftware/spine-core'

export class SpineApp implements spine.SpineCanvasApp {
  private skeleton: unknown // type: spine.Skeleton
  private state: unknown // type: spine.AnimationState
  private pixelRatio: number = window.devicePixelRatio || 1

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
    // skeletonの大きさをセット
    this.skeleton.scaleX = 0.5 * this.pixelRatio
    this.skeleton.scaleY = 0.5 * this.pixelRatio
    // skeletonの位置をセット
    this.skeleton.x = 0
    this.skeleton.y =
      (Math.floor(
        this.skeleton.data.height * this.skeleton.scaleY * this.pixelRatio
      ) /
        2) *
      -1

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

    // canvasに対してイベントを設置
    canvas.input.addListener({
      // 押下した時
      down: (x, y) => {
        if (!(this.skeleton instanceof spine.Skeleton)) return
        const skelBounds = new SkeletonBounds()
        skelBounds.update(this.skeleton, true)
        // 境界ボックスアタッチメントのヒット判定を取得
        const hitPoint = skelBounds.containsPoint(
          x - canvas.gl.drawingBufferWidth / 2,
          y - canvas.gl.drawingBufferHeight / 2
        )
        console.log(hitPoint ? 'hit' : 'not hit')
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
