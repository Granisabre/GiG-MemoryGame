import { Sprite, Container } from "pixi.js"
import sound from 'pixi-sound'
import store from '@/services/store'
import GameConfig from '@/config/game'

class Card extends Container {
  private cover : Sprite
  private reveal : Sprite
  public matched : boolean = false
  protected revealedImage : string

  constructor (index : number) {
    super();

    this.name = 'card' // names for inspector
    this.cover = new Sprite(store.resources.cards.textures[GameConfig.CardCovers])
    this.cover.name = 'cover'
    this.revealedImage = store.gameState.symbols[index]
    this.reveal = new Sprite(store.resources.cards.textures[this.revealedImage])
    this.reveal.name = 'reveal'

    this.reveal.visible = false
    this.cover.visible = true

    this.addChild(this.cover)
    this.addChild(this.reveal)

    this.on('pointerdown', this.revealCard)
    this.interactive = true;
  }

  revealCard () {
    // do tween here instead
    // use skew to imitate card flip in 2d
    if (!store.cardsAnimating && !store.endGame) {
      sound.play('flip')
      this.reveal.visible = !this.reveal.visible
      this.cover.visible = !this.cover.visible
      store.$emitter.emit('CardFlipped')
      this.interactive = false
    }
  }

  concealCard () {
    // do tween here instead
    // use skew to imitate card flip in 2d
    sound.play('flip')
    this.reveal.visible = !this.reveal.visible
    this.cover.visible = !this.cover.visible
    this.interactive = true
  }

  isRevealed () {
    return this.reveal.visible
  }

  checkMatched (revealed : Card[]) {
    revealed.forEach(card => {
      if (this.revealedImage === card.revealedImage) {
        card.setMatched()
        this.setMatched()
      }
    })

    return this.matched
  }

  setMatched () {
    this.matched = true
    this.interactive = false
    this.off('pointerdown')
  }
}

export default Card