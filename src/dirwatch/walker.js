/* eslint no-plusplus: "off" */

import * as path from 'path';
import * as fs from 'fs';

export default function walk(folderPath, callback, done) {
  fs.readdir(folderPath, (err, list = []) => {
    if (err) {
      console.log(`[ERROR]: ${err.message}`);
      return;
    }
    let i = 0;
    // store files are found through walk to find if any of them were deleted
    let files = [];

    (function next() {
      const filename = list[i++];
      if (!filename) return done(null, files);

      const filePath = path.join(folderPath, filename);
      fs.lstat(filePath, (statErr, data) => {
        if (statErr) return done(statErr);

        if (data && data.isDirectory()) {
          walk(filePath, callback, (walkErr, newFiles) => {
            if (walkErr) return done(walkErr);
            files = files.concat(newFiles);
            next();
          });
        } else {
          callback(filePath, data);
          files.push(filePath);
          next();
        }
      });
    })();
  });
}
