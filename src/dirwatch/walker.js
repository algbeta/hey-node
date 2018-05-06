import * as path from 'path';
import * as fs from 'fs';

export default function walk(folderPath, callback, done) {
  fs.readdir(folderPath, (err, list = []) => {
    let i = 0;
    let files = [];
   
    (function next() {
      const filename = list[i++];
      if (!filename) return done(null, files);

      const filePath = path.join(folderPath, filename);
      fs.lstat(filePath, (statErr, data) => {
        if (statErr) return done(statErr);

        if (data && data.isDirectory()) {
          walk(filePath, callback, (err, newFiles) => {
            if (err) return done(err);
            files = files.concat(newFiles);
            next();
          });
        } else {
          callback(filePath, data);
          files.push(filePath);
          next();
        }
      })
    })();
  });
}