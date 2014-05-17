'use strict';

var expect = require('chai').expect;
var scaffold = require('../');
var fs = require('fs-sync');
var node_path = require('path');
var tmp = require('tmp-sync');

var fixtures = node_path.join(__dirname, 'fixtures');
var expected = node_path.join(fixtures, 'expected');

function expect_file (to, expected, name, expect_name) {
  var content = fs.read( node_path.join(to, name) );
  var expect_content = fs.read( node_path.join(expected, expect_name || name) );
   expect(content).to.equal(expect_content);
}

describe("scaffold-generator", function(){
  it(".generate(from, to, callback), override=false", function(done){
    var to = tmp.make(fixtures);
    var from = node_path.join(fixtures, 'template');
    fs.write( node_path.join(to, 'lib/index.js'), 'abc');

    scaffold({
      data: {
        name: 'cortex',
        main: 'lib/index.js'
      }

    }).generate(from, to, function (err) {
      expect_file(to, expected, 'package.json');

      // no change
      expect( fs.read(node_path.join(to, 'lib/index.js')) ).to.equal('abc');
      expect(err).to.equal(null);
      done();
    });
  });

  it(".generate(from, to, callback), override=true", function(done){
    var to = tmp.make(fixtures);
    var from = node_path.join(fixtures, 'template');
    fs.write( node_path.join(to, 'lib/index.js'), 'abc');

    scaffold({
      data: {
        name: 'cortex',
        main: 'lib/index.js'
      },
      override: true

    }).generate(from, to, function (err) {
      expect_file(to, expected, 'package.json');
      expect_file(to, expected, 'lib/index.js', 'index.js');
      expect(err).to.equal(null);
      done();
    });
  });
});