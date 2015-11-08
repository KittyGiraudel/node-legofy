const doc = `
Usage: node-legofy

Options:
  -h, --help             Bring help.
  --version              Show version.
  -f, --format=<format>  Set output format ('png' or 'jpeg') [default: jpeg].
`

import { docopt } from 'docopt'
import pipe from 'multipipe'
import legofy from './index'
import pkg from '../package.json'

const elapsed = (start, end) => end - start
const elapsedSeconds = (start, end) => elapsed(start, end) / 1000
const display = seconds => console.error(`Image LEGOfied in ${seconds} seconds.`)

export default function cli (argv) {
  const opts = docopt(doc, { version: pkg.version, argv })
  const legofyOpts = { format: opts['--format'] }
  const time = Date.now()
  const end = () => display(elapsedSeconds(time, Date.now()))

  pipe(process.stdin, legofy(legofyOpts).on('end', end), process.stdout)
    .on('error', console.error)
}
