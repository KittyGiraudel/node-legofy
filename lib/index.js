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

  let data = this.ctx.getImageData(
    x, y,
    this.brick.width, this.brick.height
  ).data;
  let i = -4;
  let count = 0;
  let rgb = {
    red: null,
    green: null,
    blue: null
  };

  while ((i += pixelInterval * 4) < data.length) {
    count++;
    Object.assign(rgb, {
      red: (rgb.red + data[i]),
      green: (rgb.green + data[i + 1]),
      blue: (rgb.blue + data[i + 2])
    });
  }

  return Object.assign(rgb, {
    red: Math.floor(rgb.red / count),
    green: Math.floor(rgb.green / count),
    blue: Math.floor(rgb.blue / count)
  });
};

Legofy.prototype.updateBrickColor = function (startX, startY, averageColor) {
  const pixels = this.ctx.getImageData(
    startX, startY,
    this.brick.width, this.brick.height
  );
  let data = pixels.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] + averageColor.red;
    data[i + 1] = data[i + 1] + averageColor.green;
    data[i + 2] = data[i + 2] + averageColor.blue;
  }

  this.ctx.putImageData(pixels, startX, startY);
};

Legofy.prototype.addBrick = function (x, y) {
  const startX = (x * this.brick.width);
  const startY = (y * this.brick.height);
  const averageColor = this.getAverageColor(startX, startY);

  // Draw brick
  this.ctx.drawImage(this.brick, startX, startY);

  // Update its color
  this.updateBrickColor(startX, startY, averageColor);
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

  // Add bricks on top of the image
  for (let x = 0; x < countX; x++) {
    for (let y = 0; y < countY; y++) {
      this.addBrick(x, y);
    }
  }
};

export default Legofy;
