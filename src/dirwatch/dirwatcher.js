import EventEmitter from 'events';
import * as path from 'path';
import * as config from '../config';
import { clearInterval, setInterval } from 'timers';
import walk from './walker';

class DirWatcher extends EventEmitter {
  constructor(folderPath) {
    super();

    this.files = {};
    if (folderPath) this.folderPath = folderPath;

    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.processFolderChanges = this.processFolderChanges.bind(this);
    this.getInitialFilesList = this.getInitialFilesList.bind(this);
    this.processFileChanges = this.processFileChanges.bind(this);
    this.processFolderChanges = this.processFolderChanges.bind(this);
    this.onFolderChangeComplete = this.onFolderChangeComplete.bind(this);
  }

  init(folderPath) {
    if (folderPath) this.folderPath = folderPath;
    this.start();
  }

  start() {
    if (!this.folderPath) {
      console.log('[ERROR]: Please, provide folder path');
      return;
    }
    this.getInitialFilesList(() => {
      this.intervalId = setInterval(this.processFolderChanges, 5000);
    });
  }

  // not used in this app but seems logical to have
  stop() {
    this.intervalId && clearInterval(this.timeoutId);
  }

  getInitialFilesList(done) {
    const folderPath = path.join(__dirname, this.folderPath);
    walk(
      folderPath,
      (file, data) => {
        this.files[file] = data;
      },
      err => {
        if (err) {
          console.log(`[ERROR]: ${err.message}`);
        } else if (done) {
          done();
        }
      }
    );
  }

  processFileChanges(file, data) {
    if (!this.files[file] || data.mtimeMs > this.files[file].mtimeMs) {
      console.log(`[LOG]: ${file} has changed`);
      this.files[file] = data;
      this.emit(config.changeEvent, file);
    }
  }

  /*
   * I do not pay attention on new/old folders but files in them are counted
  */
  processFolderChanges() {
    const folderPath = path.join(__dirname, this.folderPath);
    walk(
      folderPath,
      (file, data) => {
        this.processFileChanges(file, data);
      },
      this.onFolderChangeComplete
    );
  }

  onFolderChangeComplete = (err, files) => {
    if (err) console.log(`[ERROR]: ${err.message}`);
    const keys = Object.keys(this.files);
    if (files.length !== keys.length) {
      const deletedFiles = keys.filter(file => files.indexOf(file) < 0);
      console.log(`[LOG]: Files were deleted: ${deletedFiles}`);
      deletedFiles.forEach(key => {
        delete this.files[key];
      });

      this.emit(config.changeEvent);
    }
  };
}

export default DirWatcher;
