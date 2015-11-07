import duplex from 'duplexer'
import concat from 'concat-stream'
import { PassThrough } from 'readable-stream'
import Canvas from 'canvas'
import brick from './brick'

const getAverageColor = data => data
  .reduce((rgb, c, i) => (rgb[i % 4] += c, rgb), [0, 0, 0])
  .map(c => Math.floor(c / (data.length / 4)))

const renderBrick = (ctx, x, y) => {
  const color = getAverageColor(
    ctx.getImageData(
      x, y, brick.width, brick.height).data)

  ctx.clearRect(x, y, brick.width, brick.height)
  ctx.drawImage(brick, x, y)
  ctx.fillStyle = `rgb(${color.join(',')})`
  ctx.fillRect(x, y, brick.width, brick.height)
}

const render = body => {
  const image = Object.assign(new Canvas.Image(), { src: body })
  const xCount = Math.round(image.width / brick.width)
  const yCount = Math.round(image.height / brick.height)
  const canvas = new Canvas(xCount * brick.width, yCount * brick.height)
  const ctx = canvas.getContext('2d')

  ctx.globalCompositeOperation = 'hard-light'
  ctx.drawImage(image, 0, 0)

  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      renderBrick(ctx, x * brick.width, y * brick.height)
    }
  }

  return canvas.jpegStream()
}

export default (input, output, cat = new PassThrough()) =>
  duplex(concat(body => render(body).pipe(cat)), cat)
