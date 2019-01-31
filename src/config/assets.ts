const assets = {
  "loader": {
    "textures": [
      {
        "name": "background",
        "path": "../src/assets/images/background.png"
      }
    ],
    "spritesheets": []
  },
  "game": {
    "textures": [],
    "spritesheets": [
      {
        "name": "cards",
        "path": "../src/assets/images/themes.json"
      }
    ],
    "sounds": [
      {
        "name": "background",
        "options": {
          "url": "../src/assets/sounds/background_audio.ogg",
          "preload": true
        }
      },
      {
        "name": "flip",
        "options": {
          "url": "../src/assets/sounds/flip.ogg",
          "preload": true
        }
      },
      {
        "name": "win",
        "options": {
          "url": "../src/assets/sounds/win.ogg",
          "preload": true
        }
      }
    ]
  }
}

export default assets