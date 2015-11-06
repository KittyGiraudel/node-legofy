import fs from 'fs';
import path from 'path';
import Canvas from 'canvas';

const Image = Canvas.Image;

/**
 * Legofy main function
 * @constructor
 * @param {Object} options - Object of options
 */
let Legofy = function (options = {}) {
  this.options = options;
  this.options.input = options.input || '';
  this.options.callback = options.callback || (() => {});
  this.options.init = options.init;

  if (this.options.init !== false) {
    this.initialize();
  }
};

/**
 * Initialiaze function; auto called when `init` option is not `false`, otherwise
 * must be called manually.
 * @return {Object} - Self
 */
Legofy.prototype.initialize = function () {
  this.canvas = new Canvas(400, 400);
  this.ctx = this.canvas.getContext('2d');
  this.brick = new Image();
  this.brick.src = './images/brick.png';
  this.image = this.loadImage(this.options.input);
  this.updateImage();
  this.writeImage(this.getOutputPath(), this.options.callback);

  return this;
};

/**
 * Helper function to load image located at `source`, running `callback` when
 * fully loaded
 * @param  {String}   source   - Path to the image to load
 * @param  {Function} callback - Callback function to run when image loaded
 * @return {Image}             - Loaded image
 */
Legofy.prototype.loadImage = function (source, callback) {
  let image = new Image();
  image.src = source;
  image.onload = callback;
  image.onerror = err => console.log(err);
  return image;
};

/**
 * Write content of main canvas at `destination`, running `callback` once done.
 * @return {Stream} - Writing stream
 */
Legofy.prototype.writeImage = function (destination = this.getOutputPath(), callback = this.options.callback) {
  const out = fs.createWriteStream(destination);
  const stream = this.canvas.pngStream();

  return stream
    .on('data', chunk => out.write(chunk))
    .on('error', error => console.log(error))
    .on('end', this.options.callback);
};

/**
 * Get the average color of a zone starting at `x:y`, ending at 
 * `(x + brick.width):(y + brick.height)` and return it as an array of 3 color
 * channels (red, green and blue).
 * @param  {Number} x - Starting X coordiante
 * @param  {Number} y - Starting Y coordinate
 * @return {Array}    - Color as an array of red, green and blue color channels
 */
Legofy.prototype.getAverageColor = function (x, y) {
  const pixelInterval = 5;

  let i = -4;
  let count = 0;
  let rgb = [0, 0, 0];
  let data = this.ctx.getImageData(
    x, y,
    this.brick.width, this.brick.height
  ).data;

  while ((i += pixelInterval * 4) < data.length) {
    count++;
    rgb = rgb.map((c, j) => c + data[i + j]);
  }

  return rgb.map(c => Math.floor(c / count));
};

/**
 * Main function to update the canvas with LEGO bricks
 * @return {Object} - Self
 */
Legofy.prototype.updateImage = function () {
  // Compute a round number of bricks on both axis
  let countX = Math.round(this.image.width / this.brick.width);
  let countY = Math.round(this.image.height / this.brick.height);

  // Resize the canvas to make it possible to fit a round number of bricks
  this.canvas.width = (countX * this.brick.width);
  this.canvas.height = (countY * this.brick.height);

  // Draw the image in canvas
  this.ctx.drawImage(this.image, 0, 0);

  // Create a second canvas for brick color manipulation
  const canvas = new Canvas(this.brick.width, this.brick.height);

  // Add bricks on top of the image
  for (let x = 0; x < countX; x++) {
    for (let y = 0; y < countY; y++) {
      this.addBrick(canvas, x, y);
    }
  }

  return this;
};

/**
 * Function to add a brick on main canvas of the average color found at the area
 * of a brick size starting at `x:y`
 * @param {Canvas} canvas - Alternate canvas used for fast rendering
 * @param {Number} x      - Starting X coordinate
 * @param {Number} y      - Starting Y coordinate
 */
Legofy.prototype.addBrick = function (canvas, x, y) {
  const ctx = canvas.getContext('2d');
  const startX = (x * this.brick.width);
  const startY = (y * this.brick.height);

  // Draw brick in external canvas
  this.drawBrick(canvas, startX, startY);

  // Update main canvas with second canvas render
  this.ctx.putImageData(
    ctx.getImageData(0, 0, canvas.width, canvas.height),
    startX, startY
  );
};

/**
 * Function to draw a colored brick on an external canvas
 * @param {Canvas} canvas - Alternate canvas used for fast rendering
 * @param {Number} x      - Starting X coordinate
 * @param {Number} y      - Starting Y coordinate
 */
Legofy.prototype.drawBrick = function (canvas, x, y) {
  // Get average color for brick from main canvas
  const color = this.getAverageColor(x, y);

  // Wipe out alternate canvas for new brick
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw brick and tint it with a composite mode
  ctx.drawImage(this.brick, 0, 0);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = `rgb(${color.join(',')})`;
  ctx.fillRect(0, 0, this.brick.width, this.brick.height);
};

/**
 * Helper to get the output file path based on the input file path
 * @return {String} - Output file path
 */
Legofy.prototype.getOutputPath = function () {
  let input = this.options.input;
  let filename = path.basename(input, path.extname(input));

  return path.join(path.dirname(input), `${filename}.lego.png`);
};

export default Legofy;
