const fs = require('fs');
const test = require('redtape')();
const expandGlobList = require('../');

test('mock fs', (t) => {
  fs.readdir = (path, cb) => {
    process.nextTick(() => {
      cb(new Error('mock fs.readdir error'));
    });
  };
  t.pass('mocked');
  t.end();
});

test('rejected promise', (t) => {
  expandGlobList(['*']).catch((err) => {
    t.ok(err, 'expecting mock error');
    t.end();
  });
});
