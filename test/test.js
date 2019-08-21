const expect = require('chai').expect
const {writeFile} = require('../lib/helper_functions.js');
const fse = require('fs-extra')

describe('#writeFile()', function(){
  it('should return "update" when index.html exists', function(done){
    writeFile('test/sample/index.html','<html></html>')
      .then(msg => {
        expect(msg).to.equal('update');
      }).then(done);
  })

  it('should create sw.js if does not exist', function(done){
    writeFile('test/sample/sw.js','const caches = []')
      .then(() => {
        expect(fse.existsSync('test/sample/sw.js')).to.equal(true);
      })
      .then(done)
      .then(() => {
        fse.removeSync('test/sample/sw.js')
      });
  })
})
