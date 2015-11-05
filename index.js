import fs from 'fs'
import Canvas from 'canvas'

const Image = Canvas.Image;

/**
 * Load image into canvas
 */
function loadImage (canvas, source) {
  let image = new Image
  image.src = source

  return image
}

/**
 * Output the content of a canvas as a file
 */
function writeImage (canvas, destination, callback) {
  const out = fs.createWriteStream(destination)
  const stream = canvas.pngStream()

  return stream
    .on('data', chunk => out.write(chunk))
    .on('end', callback)
}

/**
 * Update the image in canvas
 */
function updateImage (canvas, image) {
  const BRICK_SRC = './images/brick.png'

  let ctx = canvas.getContext('2d')
  let brick = new Image
  brick.src = BRICK_SRC

  canvas.width = (Math.round(image.width / brick.width) * brick.width)
  canvas.height = (Math.round(image.height / brick.height) * brick.height)

  ctx.drawImage(image, 0, 0)

  return image
}

(function () {
  const IMAGE_SRC = './images/sample.jpg'
  const OUTPUT_SRC = './images/sample.lego.png'
  const canvas = new Canvas(400, 400)

  let image = loadImage(canvas, IMAGE_SRC)
  updateImage(canvas, image)
  writeImage(canvas, OUTPUT_SRC, () => console.log('Over.'))
}())
