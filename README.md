# node-legofy

*This project is a Node.js port of the [Legofy](https://github.com/JuanPotato/Legofy) Python library from [Juan Potato](https://github.com/JuanPotato). Full feature and API parity is not ensured.*

LEGOfy aims at converting an image (no GIF support) into a mosaic of 1&times;1 colored bricks. It is useless but hell a lot of fun. See the [example](#example) for, y’know, an example.

* [Installation](#installation)
* [Usage (CLI)](#usage-cli)
* [Usage (Node)](#usage-node)
* [Usage (Vinyl/Gulp)](#usage-vinylgulp)
* [Example](#example)
* [Troubleshooting](#troubleshooting)
* [Benchmark](#benchmark)
* [Credits](#credits)

## Installation

```sh
npm install -g node-legofy
```

## Usage (CLI)

<!-- BEGIN USAGE -->

LEGOfy input image from stdin and send output to stdout.

```
legofy [options]
```

### Options

Name | Description
---- | -----------
`-h, --help` | Bring help.
`-v, --version` | Show version.
`-f, --format=<format>` | Set output format (`png` or `jpeg`) [default: jpeg].
`-q, --quality=<quality>` | Preset for the performance/quality options [default: good].
`--pixel-interval=<interval>` | Set pixel interval for average color computation (higher means faster but less accurate).
`--pattern-quality=<quality>` | Canvas pattern quality.
`--filter-quality=<quality>` | Canvas filter quality (same values as pattern quality).

The options taking a quality argument can be one of `fast`, `good`, `best`,
and `nearest`.

<!-- END USAGE -->

Example:

```
legofy < images/benchmark/sample-1.jpg > images/benchmark/sample-1.lego.jpg
```

## Usage (Node)

```js
import legofy from 'node-legofy'

inputStream
  .pipe(legofy())
  .pipe(outputStream)
```

## Usage (Vinyl/Gulp)

Using the [vinyl-transform] package to adapt a Node.js transform stream
to a Vinyl stream.

[vinyl-transform]: https://www.npmjs.com/package/vinyl-transform

```js
import fs from 'vinyl-fs'
import transform from 'vinyl-transform'
import legofy from 'node-legofy'

fs.src('images/*.png')
  .pipe(transform(legofy))
  .pipe(fs.dest('dest/'))
```

## Example

![Initial image](https://raw.githubusercontent.com/KittyGiraudel/node-legofy/master/images/benchmark/sample-1.jpg)

![Processed image](https://raw.githubusercontent.com/KittyGiraudel/node-legofy/master/images/benchmark/sample-1.lego.jpg)

## Troubleshooting

On Mac OS X, there is an installation issue with `cairo` not being found. In this case, you can easily install all [`node-canvas` module dependencies](https://github.com/Automattic/node-canvas#installation) through Homebrew:

```sh
brew install pkg-config cairo libpng jpeg giflib
```

And install Xcode Command Line Tools if you didn’t do it before:

```sh
xcode-select --install
```

## Benchmark

```
npm run benchmark
```

## Credits

* [Juan Potato](https://github.com/JuanPotato) for the original Python library
* [Kitty Giraudel](https://twitter.com/KittyGiraudel) for the Node.js version
* [Valérian Galliat](https://twitter.com/valeriangalliat) for the Node.js refactoring and help
