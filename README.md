# node-legofy

This project is a Node.js port of [Legofy](https://github.com/JuanPotato/Legofy) from [Juan Potato](https://github.com/JuanPotato). Full feature parity is not ensured.

**/!\ This project is not released yet on `npm`, so you would have to fork it in order to use it.**

## Usage (CLI)

```sh
$ bin/node-legofy < images/sample.png > images/sample.lego.png
```

## Usage (Node)

```js
inputStream
  .pipe(legofy())
  .pipe(outputStream)
```

## Example

![Initial image](https://raw.githubusercontent.com/HugoGiraudel/node-legofy/master/images/sample.png)

![Processed image](https://raw.githubusercontent.com/HugoGiraudel/node-legofy/master/images/sample.lego.png)

## Credits

* [Juan Potato](https://github.com/JuanPotato) for the original Python library
* [Hugo Giraudel](https://twitter.com/HugoGiraudel) for the Node.js version
* [Valérian Galliat](https://twitter.com/valeriangalliat) for the Node.js refactoring and help
