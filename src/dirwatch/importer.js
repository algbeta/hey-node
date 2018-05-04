import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import * as csvjson from 'csvjson';
import * as config from '../config';

class Importer {
  importAsync(pathToFile, callback) {
    fs.readFile(path.join(__dirname, pathToFile), config.encoding, (err, data) => {
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

  importSync(pathToFile) {
    try {
      const data = fs.readFileSync(path.join(__dirname, pathToFile), { encoding: config.encoding });
      return csvjson.toObject(data, {
        delimiter: config.delimiter
      });
    } catch (err) {
      console.log(err.message);
    }
  }
}

Importer.prototype.import = promisify(Importer.prototype.importAsync);

export default Importer;
