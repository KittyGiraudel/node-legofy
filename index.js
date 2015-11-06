import fs from 'fs';
import Canvas from 'canvas';

const Image = Canvas.Image;

/**
 * Load image into canvas
 */
function loadImage (canvas, source) {
  let image = new Image();
  image.src = source;

  return image;
}

/**
 * Output the content of a canvas as a file
 */
function writeImage (canvas, destination, callback) {
  const out = fs.createWriteStream(destination);
  const stream = canvas.pngStream();

  return stream
    .on('data', chunk => out.write(chunk))
    .on('error', error => console.log(error))
    .on('end', callback);
}

function addBrick (canvas, brick, x, y) {
  const ctx = canvas.getContext('2d');

  const startX = x * brick.width;
  const startY = y * brick.height;
  const pixelInterval = 5;

  let data = ctx.getImageData(startX, startY, brick.width, brick.height).data;
  let i = -4;
  let count = 0;
  let rgb = { r: null, g: null, b: null };

  while ((i += pixelInterval * 4) < data.length) {
    count++;
    rgb.r += data[i];
    rgb.g += data[i + 1];
    rgb.b += data[i + 2];
  }

  // floor the average values to give correct rgb values (ie: round number values)
  rgb = {
    r: Math.floor(rgb.r / count),
    g: Math.floor(rgb.g / count),
    b: Math.floor(rgb.b / count)
  };

  ctx.drawImage(brick, startX, startY);

  let pixels = ctx.getImageData(startX, startY, brick.width, brick.height);
  data = pixels.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] + rgb.r;
    data[i + 1] = data[i + 1] + rgb.g;
    data[i + 2] = data[i + 2] + rgb.b;
  }

  ctx.putImageData(pixels, startX, startY);
}

/**
 * Update the image in canvas
 */
function updateImage (canvas, image) {
  const BRICK_SRC = './images/brick.png';

  let ctx = canvas.getContext('2d');
  let brick = new Image();
  brick.src = BRICK_SRC;

  let countX = Math.round(image.width / brick.width);
  let countY = Math.round(image.height / brick.height);

  canvas.width = (countX * brick.width);
  canvas.height = (countY * brick.height);

  ctx.drawImage(image, 0, 0);

  for (let i = 0; i < countX; i++) {
    for (let j = 0; j < countY; j++) {
      addBrick(canvas, brick, i, j);
    }
  }

  return image;
}

(function () {
  const IMAGE_SRC = './images/sample.jpg';
  const OUTPUT_SRC = './images/sample.lego.png';
  const canvas = new Canvas(400, 400);

  let image = loadImage(canvas, IMAGE_SRC);
  updateImage(canvas, image);
  writeImage(canvas, OUTPUT_SRC, () => console.log('Over.'));
}());
