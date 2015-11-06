import Legofy from './lib';

(function () {
  const time = new Date().valueOf();
  let options = {
    input: './images/sample.jpg',
    output: './images/sample.lego.png',
    init: false
  };

  options.callback = () => {
    console.log(`File ${options.output} generated in ${(new Date().valueOf() - time) / 1000} seconds.`);
  };

  const lego = new Legofy(options);

  lego.initialize();
}());
