import * as config from './config';
import Importer from './dirwatch/importer';
import DirWatcher from './dirwatch/dirwatcher';

const dirwatcher = new DirWatcher();

dirwatcher.on(config.changeEvent, fileName => {
  fileName &&
    Importer.importAsync(fileName, (err, data) => {
      if (err) {
        console.log(`[ERROR]: ${err.message}`);
      } else if (data) {
        console.log(`[LOG]: ${fileName} content: ${JSON.stringify(data)}`);
      }
    });
});

dirwatcher.init('../../data');
