import path from 'path'
import Canvas from 'canvas'

export default Object.assign(new Canvas.Image(), {
  src: path.resolve(__dirname, '../images/brick.png')
})
