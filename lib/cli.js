let doc = `
Usage:
  node-legofy <input> [<output>]
Arguments:
  <input>    Path to input image file.
  <output>   Path to output image file.
Options:
  -h, --help            Bring help.
  --version             Show version.
`;

import { docopt } from 'docopt';
import Legofy from './index';
import pkg from '../package.json';

export default function cli (argv) {
  let options = docopt(doc, {
    version: pkg.version, argv: argv
  });

  new Legofy({
    input: options['<input>'],
    output: options['<output>'],
    callback: () => console.log('Done.')
  });
}
