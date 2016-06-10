'use strict';

const glob = require('glob');

function expandGlob(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if(err) return reject(err);
      resolve(files.join(' '));
    });
  });
}

function expandGlobList(globList, outputStream) {
  const ps = globList.map(p => expandGlob(p));

  return Promise.all(ps).then(function (result) {
    outputStream.write(result.join(' '));
  });
}

module.exports = expandGlobList;
