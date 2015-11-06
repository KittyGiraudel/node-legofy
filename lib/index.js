import fs from 'fs';
import Canvas from 'canvas';

const Image = Canvas.Image;

let Legofy = function (options) {
  this.options = Object.assign({
    input: '',
    output: '',
    callback: () => {},
    init: true
  }, options);

  if (this.options.init) {
    this.initialize();
  }
};

Legofy.prototype.initialize = function () {
  this.canvas = new Canvas(400, 400);
  this.ctx = this.canvas.getContext('2d');
  this.brick = new Image();
  this.brick.src = './images/brick.png';
  this.image = this.loadImage(this.options.input);
  this.updateImage();
  this.writeImage();
};

Legofy.prototype.loadImage = function (source, callback) {
  let image = new Image();
  image.src = source;
  image.onload = callback;
  image.onerror = err => console.log(err);
  return image;
};

Legofy.prototype.writeImage = function () {
  const out = fs.createWriteStream(this.options.output);
  const stream = this.canvas.pngStream();

  return stream
    .on('data', chunk => out.write(chunk))
    .on('error', error => console.log(error))
    .on('end', this.options.callback);
};

Legofy.prototype.getAverageColor = function (x, y) {
  const pixelInterval = 5;

  let i = -4;
  let count = 0;
  let rgb = Array(3).fill(0);
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
};

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

export default Legofy;
