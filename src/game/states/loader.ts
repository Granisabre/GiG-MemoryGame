import * as PIXI from 'pixi.js'
import Sound, { SoundMap } from 'pixi-sound'
import Store from '@/services/store'
import Device from '@/services/device'
import AssetsConfig from '@/config/assets'
import GameConfig from '@/config/game'

class Loader {
  private isLoading : boolean = false
  private spinner !: PIXI.Graphics
  private text !: PIXI.Text

  constructor (onComplete : () => void) {
    this.loadGameAssets = this.loadGameAssets.bind(this)
    this.loadingSpinner = this.loadingSpinner.bind(this)

    Store.app = new PIXI.Application({
      antialias: Device.shouldUseAntialias(),
      resolution: Device.deviceResolution(),
      forceCanvas: Device.shouldForceCanvas(),
      transparent: false,
      autoResize: true,
      width: window.innerWidth,
      height: window.innerHeight,
      view: document.querySelector('#gameboard') as HTMLCanvasElement
    })

    document.body.appendChild(Store.app.view)

    this.loadPreLoaderAssets()
      .then(this.loadGameAssets)
      .then(this.loadGameSounds)
      .then(() => {
        this.isLoading = false;
        Store.resources = PIXI.loader.resources
        Store.app.stage.removeChild(this.spinner)
        Store.app.stage.removeChild(this.text)
      })
      .then(onComplete)
      .catch((e) => {
        console.error('Error loading assets' + e)
      })
  }

  loadingSpinner () {
    this.spinner = new PIXI.Graphics()
    this.spinner.x = window.innerWidth * 0.5
    this.spinner.y = window.innerHeight * 0.5
    Store.app.stage.addChild(this.spinner)

    let percent = 0
    const self = this
    function animate () {
      if (!self.isLoading) return
      self.spinner.rotation += 0.12
      self.spinner
        .clear()
        .lineStyle(4, 0xFFFFFF, 1)
        .moveTo(40, 0)
        .arc(0, 0, 40, 0, Math.PI * 1.8 * percent, false)
      percent = Math.abs(Math.sin(Date.now() / 1000))
      requestAnimationFrame(animate)
    }

    animate()
  }

  addAssets (assets : any) {
    assets.forEach((asset: any) => {
      PIXI.loader.add(asset.name, asset.path)
    })
  }

  loadPreLoaderAssets () : Promise<void> {
    return new Promise((resolve, reject) => {
      this.addAssets(AssetsConfig.loader.textures)
      this.addAssets(AssetsConfig.loader.spritesheets)
      PIXI.loader.onComplete.add(resolve)
      PIXI.loader.onError.add(reject)

      PIXI.loader.load()
    })
  }

  loadGameAssets () {
    return new Promise((resolve, reject) => {
      this.isLoading = true
      this.loadingSpinner()
      this.text = new PIXI.Text('', GameConfig.textStyle)
      this.text.x = window.innerWidth * 0.5 - this.text.width * 0.5
      this.text.y = window.innerHeight * 0.7

      this.addAssets(AssetsConfig.game.textures)
      this.addAssets(AssetsConfig.game.spritesheets)
      PIXI.loader.onProgress.add((loader: any, resource: any) => {
        this.text.text = `${loader.progress}% ${resource.name}`
        this.text.x = window.innerWidth * 0.5 - this.text.width * 0.5
      })
      PIXI.loader.onComplete.add(resolve)
      PIXI.loader.onError.add(reject)

      PIXI.loader.load()
    })
  }

  loadGameSounds () {
    return new Promise((resolve) => {
      let myMap: SoundMap = {}
      AssetsConfig.game.sounds.forEach((sound: any) => {
        myMap[sound.name] = sound.options
      })
      Sound.add(myMap)

      resolve()
    })
  }
}

export default Loader