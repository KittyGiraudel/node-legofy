import assert from 'assert'
import fs from 'fs'
import pipe from 'multipipe'
import digest from 'digest-stream'

const expectedHash = '21a46facadf92b53c5462d24d5e0f33a7a54f318'

export default (name, legofy) =>
  describe(`The Legofy ${name} module`, () => {
    let hash

    before(function (done) {
      this.timeout(5000)

      pipe(
        fs.createReadStream('images/benchmark/sample-3.png'),
        legofy({ format: 'png', pixelInterval: 1 }), // PNG to be deterministic
        digest('sha1', 'hex', _hash => hash = _hash),
        done)
        .resume()
    })

    it('should equal expected hash', () => assert.equal(hash, expectedHash))
  })
