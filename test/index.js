'use strict';

const tmp = require('tmp');
const redtape = require('redtape');
const expandGlobList = require('../');

const test = redtape({
  beforeEach: function (cb) {
    mockStream.data = '';
    cb();
  }
});

const mockStream = {
  data: '',
  write(str) {
    this.data += str;
  }
};

test('master test', function (t) {
  setupTmpDirectories((err) => {
    t.equal(err, null, 'Should setup up temporary directories correctly');

    test('should expand recursively to all sub-directories (/**/*.tmp)', (t) => {
      expandGlobList([ './test/**/*.tmp' ], mockStream).then(() => {
        t.equal(mockStream.data.split(' ').length, 3, 'Should expand to 3 files');
        t.end();
      });
    });

    test('should expand to all temporary files in the first level (/*.tmp)', (t) => {
      expandGlobList([ './test/*.tmp' ], mockStream).then(() => {
        t.equal(mockStream.data.split(' ').length, 1, 'Should expand to 1 file');
        t.end();
      });
    });

    test('should expand to all temporary files in the first level (/**.tmp)', (t) => {
      expandGlobList([ './test/**.tmp' ], mockStream).then(() => {
        t.equal(mockStream.data.split(' ').length, 1);
        t.end();
      });
    });

    test('should expand to all files and directories in the first level (/*)', (t) => {
      expandGlobList([ './test/*' ], mockStream).then(() => {
        t.equal(mockStream.data.split(' ').length, 4);
        t.end();
      });
    });

    t.end();
  });
});

function createDir(path, cb) {
  tmp.dir({
    dir: path
  }, cb);
}

function createFile(path, cb) {
  tmp.file({
    dir: path
  }, cb);
}

function createLevel(path, cb) {
  createDir(path, (err, createdPath) => {
    if(err) return cb(err);

    createFile(createdPath, (err) => {
      if(err) return cb(err);

      cb(null, createdPath);
    });
  });
}

// creates a structure in the filesystem like the following:
// ├── randomFileName1.tmp
// └── randomDirName1
//     ├── randomFileName2.tmp
//     └── randomDirName2
//     └── randomFileName3.tmp
function setupTmpDirectories(cb) {
  createFile(__dirname, (err) => {
    if(err) throw err;

    createLevel(__dirname, (err, path1) => {
      if(err) throw err;

      createLevel(path1, cb);
    });
  });
}
