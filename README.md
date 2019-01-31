
# webpack-typescript

Install with `yarn`

Start with `yarn start` 

Production Build with `yarn build`


## Webpack 4

- ts-loader (accepts .ts and .tsx)
- html-webpack-plugin creates a index.html
- sourcemaps enabled

## Sane defaults

- default tsconfig
- default tslint (with one override for single quote quotemark)

## TODO's
- implement Observable object for the shared store allowing reactive updates, replacing the events
- implement device features and blacklisting service to improve performance and low end device recognition in code
- tests, no time so far
- add animations and tweens to make the game 'feel' more enjoyable
- investigate buggy reveal logic, suspect this would be resolved with Observable store but didnt have time to implement it