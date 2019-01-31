import GameLoader from './states/loader'
import GamePlayer from './states/play'
import API from '@/services/api'
import Store from '@/services/store'

class Game {
  private loader: GameLoader | null = null
  private play: GamePlayer | null = null

  constructor () {
    this.loaderComplete = this.loaderComplete.bind(this)
    this.loader = new GameLoader(this.loaderComplete)

    window.addEventListener('orientationchange', this.setupGameBoard)
  }

  async loaderComplete () {
    delete this.loader;
    await API.play()
    .then((response : any) => {
      Store.gameState = response
    })

    this.setupGameBoard()
  }

  setupGameBoard () {
    if (this.play) {
      this.play.destroy()
      delete this.play
    }

    this.play = new GamePlayer()
  }
}

export default Game
