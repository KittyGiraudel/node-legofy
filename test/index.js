import Legofy from '../lib';
import assert from 'assert';

describe('The Legofy module', () => {
  const options = { input: './images/sample.jpg' };

  it('should have sentitive defaults', () => {
    const lego = new Legofy(options);

    assert.equal(typeof lego.options, 'object');
    assert.equal(lego.options.input, options.input);
    assert.equal(typeof lego.options.callback, 'function');
    assert.equal(typeof lego.options.manual, 'undefined');
    assert.equal(lego.options.manual, undefined);
  });

  it('should throw an error if input is empty or non string', () => {
    assert.throws(() => { new Legofy(); }, Error);
    assert.throws(() => { new Legofy({ input: 42 }); }, Error);
  });

  it('should not run `initialize(..)` on `manual` mode', () => {
    let lego = new Legofy({ input: options.input, manual: true });
    assert.equal(typeof lego.brick, 'undefined');
  });

  it('should do a lot of things in the `initialize(..)` method', () => {
    let lego = new Legofy({ input: options.input });
    assert.equal(typeof lego.brick, 'object');
    assert.equal(typeof lego.image, 'object');
    assert.equal(lego.image.src, options.input);
  });

  it('should create a canvas sized after the image', () => {
    let lego = new Legofy({ input: options.input, manual: true }).initialize();
    assert.equal(lego.ctx, lego.canvas.getContext('2d'));
    assert.equal(typeof lego.canvas, 'object');
    assert.equal(lego.canvas.width, lego.image.width);
    assert.equal(lego.canvas.height, lego.image.height);
  });

  it('should create a secondary canvas sized after a brick', () => {
    let lego = new Legofy({ input: options.input });
    assert.equal(typeof lego.offcanvas, 'object');
    assert.equal(lego.offcanvas.width, lego.brick.width);
    assert.equal(lego.offcanvas.height, lego.brick.height);
  });
});
