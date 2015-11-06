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

/**
 * Get the average pixel color in the area defined by `x`, `y`, `x + width` and
 * `y + height`. Returns an object containing `red`, `green` and `blue` channels.
 */
function getAverageColor (canvas, x, y, width, height) {
  const ctx = canvas.getContext('2d');
  const pixelInterval = 5;

  let data = ctx.getImageData(x, y, width, height).data;
  let i = -4;
  let count = 0;
  let rgb = {
    red: null,
    green: null,
    blue: null
  };

  while ((i += pixelInterval * 4) < data.length) {
    count++;
    rgb.red += data[i];
    rgb.green += data[i + 1];
    rgb.blue += data[i + 2];
  }

  return {
    red: Math.floor(rgb.red / count),
    green: Math.floor(rgb.green / count),
    blue: Math.floor(rgb.blue / count)
  };
}

/**
 * Update a brick color based on the average color of the image underneath.
 */
function updateBrickColor (canvas, x, y, width, height, averageColor) {
  const ctx = canvas.getContext('2d');

  let pixels = ctx.getImageData(x, y, width, height);
  let data = pixels.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] + averageColor.red;
    data[i + 1] = data[i + 1] + averageColor.green;
    data[i + 2] = data[i + 2] + averageColor.blue;
  }

  ctx.putImageData(pixels, x, y);
}

/**
 * Add a brick to the image
 */
function addBrick (canvas, brick, x, y) {
  const startX = x * brick.width;
  const startY = y * brick.height;
  const averageColor = getAverageColor(canvas, startX, startY, brick.width, brick.height);

  // Draw brick
  canvas.getContext('2d').drawImage(brick, startX, startY);

  // Update its color
  updateBrickColor(canvas, startX, startY, brick.width, brick.height, averageColor);

  return brick;
}

/**
 * Update the image in canvas
 */
function updateImage (canvas, image) {
  const BRICK_SRC = './images/brick.png';
  const ctx = canvas.getContext('2d');

  let brick = new Image();
  brick.src = BRICK_SRC;

  // Compute a round number of bricks on both axis
  let countX = Math.round(image.width / brick.width);
  let countY = Math.round(image.height / brick.height);

  // Resize the canvas to make it possible to fit a round number of bricks
  canvas.width = (countX * brick.width);
  canvas.height = (countY * brick.height);

  // Draw the image in canvas
  ctx.drawImage(image, 0, 0);

  // Add bricks on top of the image
  for (let x = 0; x < countX; x++) {
    for (let y = 0; y < countY; y++) {
      addBrick(canvas, brick, x, y);
    }
  }

  // Return image
  return image;
}

(function () {
  const IMAGE_SRC = './images/sample.jpg';
  const OUTPUT_SRC = './images/sample.lego.png';
  const canvas = new Canvas(400, 400);

  // Load the image
  let image = loadImage(canvas, IMAGE_SRC);

  // Update the image
  updateImage(canvas, image);

  // Write image to new file
  writeImage(canvas, OUTPUT_SRC, () => console.log('Over.'));
}());
