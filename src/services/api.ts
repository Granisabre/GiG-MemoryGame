import Axios from 'axios';

class API {
  play(...args : any[]) : Promise<any> {
    return Axios.get('/play', ...args)
  }
}

Axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status === 404) {
    console.error('no response from server')
    // make up a gameboard
    
    const data = {
      symbols: ["symbol14", "symbol00", "symbol00", "symbol08", "symbol04", "symbol04", "symbol08", "symbol19", "symbol14", "symbol19"],
      time: 60
    }

    data.symbols = shuffle(generateGameBoard())
    // fake a good server response
    return Promise.resolve(data)
  }
})

const generateGameBoard = () : Array<string> => {
  const card1 = Math.floor((Math.random()*53) + 1)
  const card2 = Math.floor((Math.random()*53) + 1)
  const card3 = Math.floor((Math.random()*53) + 1)
  const card4 = Math.floor((Math.random()*53) + 1)
  const card5 = Math.floor((Math.random()*53) + 1)
  const list = [card1, card2, card3, card4, card5]
  const unique = [...new Set(list)]
  if (unique.length < 5) {
    // duplicates - rerun
    return generateGameBoard()
  }
  // 5 unique values
  // add the symbol prefix and double them
  const temp = unique.map(entry => {
    const num = entry < 10 ? '0' + entry : entry
    return 'symbol' + num
  })
  
  return temp.concat(temp)
}

const shuffle = (a : Array<any>) : Array<any> => {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // required semi
      [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default new API()