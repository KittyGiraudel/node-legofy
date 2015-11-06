# node-legofy

This project is a Node.js port of [Legofy](https://github.com/JuanPotato/Legofy) from [Juan Potato](https://github.com/JuanPotato). Full feature parity is not ensured.

/!\ This project is not released yet on `npm`, so you would have to fork it in order to use it.

## Usage

```sh
$ ./bin/node-legofy <input> [<output>]
```

If `<output>` is not specified, the script should create a new file named after the first one, knowing that:

* `.lego` will be appended before the extension;
* the file will be converted to `png`, no matter if another extension at first.

```sh
# Will create `./images/sample.lego.png`
$ ./bin/node-legofy ./images/sample.jpg
```

## Credits

* [Juan Potato](https://github.com/JuanPotato) for the original Python library
* [Hugo Giraudel](https://twitter.com/HugoGiraudel) for the Node.js version
