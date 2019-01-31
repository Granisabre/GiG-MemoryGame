import Store from "@/services/store"

let interval: number = 0
Store.time = 60

export const startTimer = () => {
  Store.time = 60
  interval = setInterval(() => {
    Store.time -= 1
    Store.$emitter.emit('updateTimer')  // no needed with Observables, implement later

    if (Store.time <= 0) {
      Store.$emitter.emit('outOfTime')
      Store.time = 0
      clearInterval(interval)
    }
  }, 1000)
}

export const stopTimer = () => {
  clearInterval(interval)
}