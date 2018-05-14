import * as fs from 'fs';
import { promisify } from 'util';
import * as csvjson from 'csvjson';
import * as config from '../config';

// joined pathes should be provided 
class Importer {
  // I could have used sync import to promisify and wanted to try async readFile
  static importAsync(pathToFile, callback) {
    fs.readFile(pathToFile, config.encoding, (err, data) => {
      if (err) {
        callback(err);
      } else {
        try {
          const json = csvjson.toObject(data, {
            delimiter: config.delimiter
          });
          callback(null, json);
        } catch (convertErr) {
          callback(convertErr);
        }
      }
    });
  }

  static importSync(pathToFile) {
    try {
      const data = fs.readFileSync(pathToFile, { encoding: config.encoding });
      return csvjson.toObject(data, {
        delimiter: config.delimiter
      });
    } catch (err) {
      console.log(`[ERROR]: ${err.message}`);
    }
  }
}

// simple promise return seems to be clearer but I'd like to try promisify
Importer.import = promisify(Importer.importAsync);

export default Importer;
