import EventEmitter from 'events';
import * as path from 'path';
import * as fs from 'fs';

class DirWatcher extends EventEmitter {
  constructor() {
    super();
    this.resources = {
      initialFolderPath: null,
      watchedPathes: [],
      watchedPathesInfo: {}
    };
  }

  isUnique(filePath) {
    return !this.resources.watchedPathes.includes(filePath);
  }

  treatFile(filePath, data) {
    if (this.isUnique(filePath)) {
      this.resources.watchedPathes.push(filePath);
    } else if (data.mtimeMs > this.resources.watchedPathesInfo[path]) {
      this.emit('dirwatcher:changed');
    }
    this.resources.watchedPathesInfo[filePath] = data.mtimeMs;
  }

  // assume that initial dir is indeed a dir
  readDirRecursively(folderPath) {
    fs.readdir(path.join(__dirname, folderPath), (err, files) => {
      files && files.forEach(file => {
        fs.lstat(path.join(__dirname, folderPath, file), (statErr, data) => {
          if (data && data.isDirectory()) {
            this.readDirRecursively(path.join(folderPath, file));
          } else {
            this.treatFile(file, data);
          }
        });
      });
    });
  }
}

export default DirWatcher;
