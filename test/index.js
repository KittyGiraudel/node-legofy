import legofy from '../lib'
import assert from 'assert'
import fs from 'fs'
import pipe from 'multipipe'
import digest from 'digest-stream'

const expectedHash = '4fc1559b5f1f179c2e5dd49e2cb08cfa7eb84c96'

describe('The Legofy module', () => {
  let hash

  before(function (done) {
    this.timeout(5000)

    pipe(
      fs.createReadStream('images/sample.jpg'),
      legofy({ format: 'png' }), // PNG to be deterministic
      digest('sha1', 'hex', _hash => hash = _hash),
      done)
      .resume()
  })

  it('should equal expected hash', () => assert.equal(hash, expectedHash))
})
