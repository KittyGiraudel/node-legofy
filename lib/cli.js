const doc = `
Usage:
  node-legofy <input> [<output>]
  node-legofy

Arguments:
  <input>   Path to input image file.
  <output>  Path to output image file [default: stdout if stdout is a file,
            or '.lego' extention derived from input otherwise].

Options:
  -h, --help  Bring help.
  --version   Show version.
`

import { docopt } from 'docopt'
import pipe from 'multipipe'
import legofy from './index'
import pkg from '../package.json'

const elapsed = (start, end) => end - start
const elapsedSeconds = (start, end) => elapsed(start, end) / 1000
const display = seconds => console.error(`Image LEGOfied in ${seconds} seconds.`)

export default function cli (argv) {
  console.error('')
  const options = docopt(doc, { version: pkg.version, argv: argv })
  const time = Date.now()
  const end = () => display(elapsedSeconds(time, Date.now()))

  pipe(process.stdin, legofy().on('end', end), process.stdout)
    .on('error', console.error)
}
