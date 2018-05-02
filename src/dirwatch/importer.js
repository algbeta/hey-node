import * as path from 'path';
import * as fs from 'fs';
import * as csvjson from 'csvjson';

const encoding = 'utf8';

class Importer {
  import(pathToFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, pathToFile), encoding, (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const json = csvjson.toObject(data, {
              delimiter: ','
            });
            resolve(json);
          } catch (convertErr) {
            reject(convertErr);
          }
        }
      });
    });
  }

  importSync(pathToFile) {
    try {
      const data = fs.readFileSync(path.join(__dirname, pathToFile), { encoding });
      return csvjson.toObject(data, {
        delimiter: ','
      });
    } catch (err) {
      console.log(err.message);
    }
  }
}

export default Importer;
