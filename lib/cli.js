const doc = `
Usage: legofy [options]

Options:
  -h, --help                   Bring help.
  -v, --version                Show version.
  -f, --format=<format>        Set output format ('png' or 'jpeg')
                               [default: jpeg].
  -q, --quality=<quality>      Preset for the performance/quality options
                               [default: good].
  --pixel-interval=<interval>  Set pixel interval for average color
                               computation (higher means faster but less
                               accurate).
  --pattern-quality=<quality>  Canvas pattern quality.
  --filter-quality=<quality>   Canvas filter quality (same values as pattern
                               quality).

The options taking a quality argument can be one of 'fast', 'good', 'best',
and 'nearest'.
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

  const legofyOpts = {
    format: opts['--format'],
    quality: opts['--quality'],
    pixelInterval: opts['--pixel-interval'],
    patternQuality: opts['--pattern-quality'],
    filterQuality: opts['--filter-quality']
  }

  const time = Date.now()
  const end = () => display(elapsedSeconds(time, Date.now()))

  pipe(process.stdin, legofy(legofyOpts).on('end', end), process.stdout)
    .on('error', console.error)
}
