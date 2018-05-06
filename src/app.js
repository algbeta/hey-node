import * as config from './config';
import Importer from './dirwatch/importer';
import DirWatcher from './dirwatch/dirwatcher'

const dirwatcher = new DirWatcher();
const importer = new Importer();

dirwatcher.on(config.changeEvent, () => {
  console.log('change event caught')
});
dirwatcher.init('../../data')