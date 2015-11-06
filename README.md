# node-legofy

This project is a Node.js port of [Legofy](https://github.com/JuanPotato/Legofy) from [Juan Potato](https://github.com/JuanPotato). Full feature parity is not ensured.

## Usage

This project is not released yet on `npm`, so you would have to fork it in order to use it.

```js
import Legofy from './lib';

new Legofy({
  input: './images/sample.jpg',
  output: './images/sample.lego.png',
  callback: () => console.log('File generated.')
});
```

## Credits

* [Juan Potato](https://github.com/JuanPotato) for the original Python library
* [Hugo Giraudel](https://twitter.com/HugoGiraudel) for the Node.js version
