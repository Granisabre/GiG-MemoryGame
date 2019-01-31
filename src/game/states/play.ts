import store from '@/services/store'
import { Sprite, Container, utils } from 'pixi.js'
import Sound from 'pixi-sound'
import API from '@/services/api'
import { startTimer, stopTimer } from '@/services/helpers'
import Card from '@/game/card'
import GameConfig from '@/config/game'

class Play {
  private background !: Sprite
  private root : Container
  private timer : number = 0
  private cardsSelected : number = 0
  private winText!: PIXI.Text
  private loseText!: PIXI.Text
  private playText!: PIXI.Text
  private timerText!: PIXI.Text

  constructor () {
    this.root = new Container()
    this.root.name = 'root'
    this.root.x = 0
    this.root.y = 0
    store.app.stage.addChild(this.root)
    store.cardsAnimating = false
    store.endGame = true

    this.setupText()
    this.setupBackground()
    this.setupGameBoard()

    this.setupEvents()
  }

  setupBackground () {
    this.background = new Sprite(store.resources.background.texture)
    this.background.width = window.innerWidth
    this.background.height = window.innerHeight
    store.app.stage.addChildAt(this.background, 0)
  }

  setupGameBoard () {
    let layout = [2, 3, 3, 2]
    // logic here for different gameboards

    this.buildBoard(layout);
  }

  buildBoard(layout: Array<number>) {
    const targetHeight = 200 // adjust for resolution
    const targetWidth = targetHeight * 0.5
    const padding = targetHeight * 0.05

    let counter = 0
    layout.forEach((row, index) => {
      let container = new PIXI.Container()
      container.name = 'row'
      let column = 1;
      do {
        let card = new Card(counter)
        card.x = (targetWidth + padding) * (column - 1)
        card.height = targetHeight
        card.width = targetWidth
        container.addChild(card)
        
        column += 1
        counter += 1
      } while (column <= row)
      this.root.addChild(container)
      container.y = padding + (targetHeight + padding) * index
    })

    this.positionBoard()
  }

  positionBoard () {
    this.root.children.forEach((container) => {
      container.x = this.root.width * 0.5 - (container as Container).width * 0.5
    })
    this.root.x = window.innerWidth * 0.5 - this.root.width * 0.5
    this.root.y = window.innerHeight * 0.5 - this.root.height * 0.5
  }

  setupEvents () {
    store.$emitter = new utils.EventEmitter()
    store.$emitter.on('CardFlipped', this.handleCardFlip.bind(this))
    store.$emitter.on('outOfTime', this.endGame.bind(this))
    store.$emitter.on('updateTimer', () => {
      this.timerText.text = store.time
    })
  }

  handleCardFlip () {
    this.cardsSelected += 1
    if (this.cardsSelected >= 2) {
      store.cardsAnimating = true
    }
    this.timer = setTimeout(this.handleGame.bind(this), 1000)
  }

  handleGame () {
    const result: Card[] = []
    const revealed: Card[] = []
    this.root.children.forEach((row) => {
      (row as Container).children.forEach((card) => {
        if ((card as Card).isRevealed()) {
          if ((card as Card).checkMatched(revealed)) {
            result.push(card as Card)
          }
          revealed.push(card as Card)
        }
      })
    })

    if (revealed.length - result.length === 2) {
      revealed.forEach(card => {
        if (!card.matched) {
          card.concealCard()
        }
      })
    }

    this.checkForWin()
    this.timer = 0

    store.cardsAnimating = false
    this.cardsSelected = 0
    return result
  }

  checkForWin () {
    let matches = 0

    this.root.children.forEach((row) => {
      (row as Container).children.forEach((card) => {
        if ((card as Card).isRevealed() && (card as Card).matched) {
          matches += 1
        }
      })
    })

    if (matches >= 10 && !this.winText.visible) {
      // WIN
      stopTimer()
      Sound.play('win')
      Sound.stop('background')
      this.winText.visible = true
      this.winText.interactive = true
      this.winText.on('pointerdown', this.resetGame.bind(this))
    }
  }

  endGame () {
    store.endGame = true
    this.youLose()
  }

  youLose () {
    Sound.stop('background')
    this.loseText.visible = true
    this.loseText.interactive = true
    this.loseText.on('pointerdown', this.resetGame.bind(this))
  }

  resetGame () {
    this.root.removeChildren()
    API.play()
    .then((response : any) => {
      store.gameState = response
    })
    this.setupGameBoard()
    this.winText.visible = false
    this.loseText.visible = false
    this.playText.visible = false
    store.endGame = false
    startTimer()
    Sound.play('background')
  }

  setupText () {
    // move these to art assets/images and tween to make it look more 'special'
    this.loseText = new PIXI.Text('Better luck nextime, to play again click here', GameConfig.textStyle)
    this.winText = new PIXI.Text('Congratulations. You WON!!! to play again click here', GameConfig.textStyle)
    this.playText = new PIXI.Text('Click to play when ready', GameConfig.textStyle)
    this.timerText = new PIXI.Text('0', GameConfig.textStyle)
    this.playText.visible = true
    this.playText.interactive = true
    this.playText.on('pointerdown', this.resetGame.bind(this))
    store.app.stage.addChild(this.playText)
    store.app.stage.addChild(this.loseText)
    store.app.stage.addChild(this.winText)
    store.app.stage.addChild(this.timerText)
    this.winText.visible = false
    this.winText.width = window.innerWidth
    this.loseText.visible = false
    this.loseText.width = window.innerWidth

    this.timerText.y = window.innerHeight - this.timerText.height
  }

  destroy () {
    store.app.stage.removeChild(this.background)
    store.app.stage.removeChild(this.root)
    store.$emitter.off('CardFlipped')
    store.$emitter.off('outOfTime')
    store.$emitter.off('updateTimer')
  }
}

export default Play