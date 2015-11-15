import duplex from 'duplexer'
import concat from 'concat-stream'
import { PassThrough } from 'readable-stream'
import Canvas from 'canvas'

const brick = `${__dirname}/../images/brick.png`
const defaultOpts = { format: 'jpeg', quality: 'good', brick }
const pixelIntervalPreset = { fast: 8, good: 5, best: 3, nearest: 2, bilinear: 1 }

// Make a function to get the average color from given image data array
// with given sample rate.
const makeGetAverageColor = pixelInterval => data => {
  let rgb = [0, 0, 0]

  for (let i = 0; i < data.length; i++) {
    if (i % (pixelInterval * 4) < 4) rgb[i % 4] += data[i]
  }

  return rgb.map(channel => Math.floor(channel / (data.length / pixelInterval / 4)))
}

// Elegant version but ditched for performance reasons, because
// `canvas` don't provide `filter` and `reduce` for some Node.js versions
// and using `Array.from` is not efficient at all. Lodash chaining do
// an awesome job also and the function doesn't have to be tweaked at all,
// but we don't want to add a new dependency.
// const makeGetAverageColor = pixelInterval => data => data
//   .filter((_, index) => index % (pixelInterval * 4) < 4)
//   .reduce((rgb, channel, index) => (rgb[index % 4] += channel, rgb), [0, 0, 0])
//   .map(channel => Math.floor(channel / (data.length / pixelInterval / 4)))

// Make a function to render a brick at a point using given brick, average
// color function and context.
const makeRenderBrick = (brick, getAverageColor, ctx) => (x, y) => {
  const { data } = ctx.getImageData(x, y, brick.width, brick.height)
  const color = getAverageColor(data)

  ctx.clearRect(x, y, brick.width, brick.height)
  ctx.drawImage(brick, x, y)
  ctx.fillStyle = formatColor(color)
  ctx.fillRect(x, y, brick.width, brick.height)
}

// Format given RGB array as a string.
const formatColor = ([r, g, b]) => `rgb(${r},${g},${b})`

// Make an `Image` object with given source.
const img = src => Object.assign(new Canvas.Image(), { src })

// Get the size in bricks of an image.
const size = (image, brick) =>
  [ image.width / brick.width, image.height / brick.height ].map(Math.floor)

const render = (opts, src) => {
  const image = img(src)
  const brick = img(opts.brick)
  const [ xCount, yCount ] = size(image, brick)
  const canvas = new Canvas(xCount * brick.width, yCount * brick.height)
  const ctx = canvas.getContext('2d')
  const pixelInterval = opts.pixelInterval || pixelIntervalPreset[opts.quality]
  const getAverageColor = makeGetAverageColor(pixelInterval)
  const renderBrick = makeRenderBrick(brick, getAverageColor, ctx)

  ctx.patternQuality = opts.patternQuality || opts.quality
  ctx.filter = opts.filterQuality || opts.quality
  ctx.globalCompositeOperation = 'hard-light'
  ctx.drawImage(image, 0, 0)

  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      renderBrick(x * brick.width, y * brick.height)
    }
  }

  return canvas[`${opts.format}Stream`]()
}

export default function legofy (opts = {}) {
  const options = Object.assign({}, defaultOpts, opts)
  const cat = new PassThrough()
  return duplex(concat(body => render(options, body).pipe(cat)), cat)
}
