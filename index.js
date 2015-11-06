import Legofy from './lib';

(function () {
  const lego = new Legofy({
    input: './images/sample.jpg',
    output: './images/sample.lego.png',
    callback: () => console.log('Over.'),
    init: false
  });

  lego.initialize();
}());
