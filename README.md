# node-legofy

This project is a Node.js port of [Legofy](https://github.com/JuanPotato/Legofy) from [Juan Potato](https://github.com/JuanPotato). Full feature parity is not ensured.

**/!\ This project is not released yet on `npm`, so you would have to fork it in order to use it.**

## Usage (CLI)

```sh
$ ./bin/node-legofy <input> [<output>]
```

If `<output>` is not specified, the script should create a new file named after the first one, knowing that `.lego` will be appended before the extension.

```sh
# Will create `./images/sample.lego.jpg`
$ ./bin/node-legofy ./images/sample.jpg
```

## Usage (Node)

```js
import Legofy from 'legofy';

new Legofy({
  // Mandatory `input` option
  input: 'path/to/file.jpg', // Or .png

  // Optional `output` option
  output: 'path/to/file.lego.jpg',

  // Optional `callback` function
  callback: () => console.log('File generated.')
});
```

If you want a clear control over what should be done, you can pass the `manual` option to `true`, which prevents the script from running everything itself. You then have to run `initialize(..)`, `render(..)`, `process(..)` and `output(..)` manually.

```js
import Legofy from 'legofy';

const lego = new Legofy({
  input: 'path/to/file.jpg',
  manual: true
});

lego
  // Initialize the module
  .initialize()
  // Render the image located at `input` in canvas
  .render()
  // Process the canvas to add the brick effect
  .process()
  // Output the render of the canvas in a file
  .output();
```

## Example

![Initial image](https://raw.githubusercontent.com/HugoGiraudel/node-legofy/master/images/sample.jpg)

![Processed image](https://raw.githubusercontent.com/HugoGiraudel/node-legofy/master/images/sample.lego.jpg)

## Credits

* [Juan Potato](https://github.com/JuanPotato) for the original Python library
* [Hugo Giraudel](https://twitter.com/HugoGiraudel) for the Node.js version
