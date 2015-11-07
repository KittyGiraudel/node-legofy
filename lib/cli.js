let doc = `
Usage:
  node-legofy <input>
Arguments:
  <input>    Path to input image file.
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

  const time = new Date().valueOf();

  new Legofy({
    input: options['<input>'],
    callback: () => console.log(`Image LEGOfied in ${(new Date().valueOf() - time) / 1000} seconds.`)
  });
}
