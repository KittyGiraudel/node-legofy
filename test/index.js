import legofy from '../lib'
import assert from 'assert'
import fs from 'fs'
import pipe from 'multipipe'
import digest from 'digest-stream'

const expectedHash = 'f47035bce47c2fe445c9a1cbc6c038d408f54e31'

describe('The Legofy module', () => {
  let hash

  before(function (done) {
    this.timeout(5000)

    pipe(
      fs.createReadStream('images/sample.png'),
      legofy({ format: 'png' }), // PNG to be deterministic
      digest('sha1', 'hex', _hash => hash = _hash),
      done)
      .resume()
  })

  it('should equal expected hash', () => assert.equal(hash, expectedHash))
})
