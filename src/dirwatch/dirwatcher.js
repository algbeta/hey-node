import EventEmitter from 'events';
import * as path from 'path';
import * as fs from 'fs';
import * as config from '../config'
import { clearInterval, setInterval } from 'timers';
import walk from './walker'

class DirWatcher extends EventEmitter {
  init(folderPath) {
    this._folderPath = folderPath;
    this._files = {};

    this.start();
  }

  start() {
    this.getInitialFilesList(() => {
      this.intervalId = setInterval(() => {
        const folderPath = path.join(__dirname, this._folderPath)
        walk(folderPath, (file, data) => {
          this.processFileChanges(file, data)
        }, (err, files) => {
          if (err) console.log(`[ERROR]: ${err.message}`);
          if (files.length !== Object.keys(this._files).length) {
            this.emit(config.changeEvent);
          }
        })
      }, 5000);
    });
  }

  stop() {
    this.intervalId && clearInterval(this.timeoutId)
  }

  getInitialFilesList(done) {
    const folderPath = path.join(__dirname, this._folderPath)
    walk(folderPath, (file, data) => {
      this._files[file] = data
    }, (err) => {
      if (err) {
        console.log(`[ERROR]: ${err.message}`);
      } else if (done) {
        done();
      }
    })
  }

  processFileChanges(file, data) {
    if (!this._files[file]  || (data.mtimeMs > this._files[file].mtimeMs)) {
      console.log(`[LOG]: ${file} has changed`);
      this._files[file] = data
      this.emit(config.changeEvent);        
    }
  }  
}

export default DirWatcher;
