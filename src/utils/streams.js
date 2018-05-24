const through = require('through2');
const path = require('path');
const commander = require('commander');
const fs = require('fs');
const csvjson = require('csvjson');
const walker = require('../dirwatch/walker');

// aux functions
function printHelpMessage() {
  console.log('[ERROR] incorrect input');
  commander.help();
}

function errorHandler(err) {
  console.log(`[ERROR] ${err.message}`);
}

/**
 * reverse implementation
 * reads console input
 * logs reversed console input
 */
function reverse() {
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  process.stdout.write('Please, enter a string: ');

  process.stdin.on('data', data => {
    if (data && data.trim()) {
      const finalData = data
        .toString()
        .trim()
        .split('')
        .reverse()
        .join('');
      process.stdout.write(`data: ${finalData}`);
      process.exit();
    }
  });
}

/**
 *  transform implemenation
 */
function write(buffer) {
  if (buffer) {
    const data = buffer.toString();
    this.push(`data: ${data.toUpperCase()}`);
  }
  process.exit();
}
function end(done) {
  done();
}

function transform() {
  const stream = through(write, end);
  process.stdout.write('Please, enter a string: ');
  process.stdin
    .pipe(stream)
    .pipe(process.stdout)
    .on('error', errorHandler);
}
/**
 * outputFile implementation
 * @param {string} file: name of file to be displayed in console
 */
function outputFile(file) {
  const reader = fs.createReadStream(path.join(__dirname, file));
  reader.on('error', errorHandler);
  reader.pipe(process.stdout).on('error', errorHandler);
}
/**
 * convertFromFile implementation
 * @param {string} file: name of csv file to be displayed in console
 */
function convertFromFile(file) {
  const reader = fs.createReadStream(path.join(__dirname, file));
  reader.on('error', errorHandler);
  const toObject = csvjson.stream.toObject();
  const stringify = csvjson.stream.stringify();
  reader
    .pipe(toObject)
    .pipe(stringify)
    .pipe(process.stdout)
    .on('error', errorHandler);
}
/**
 * convertToFile implementation
 * @param {string} file : name of csv file to be saved to json
 */
function convertToFile(file) {
  const reader = fs.createReadStream(path.join(__dirname, file));
  reader.on('error', errorHandler);
  const jsonName = file.replace('.csv', '');
  const writer = fs.createWriteStream(path.join(__dirname, `${jsonName}.json`));
  writer.on('error', errorHandler);
  const toObject = csvjson.stream.toObject();
  const stringify = csvjson.stream.stringify();
  reader
    .pipe(toObject)
    .pipe(stringify)
    .pipe(writer)
    .on('error', errorHandler);
}
/**
 * cssBuilder implementation
 * @param {*} pathToDir - path to directory to be read
 */
function cssBuilder(pathToDir) {
  const css = `.ngmp18 {
    background-color: #fff;
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .ngmp18__hw3 {
    color: #333;
  }
  .ngmp18__hw3--t7
    font-weight: bold;
  }`;

  const finalPathToDir = path.join(__dirname, pathToDir);

  walker.walkAndRead(finalPathToDir, null, (err, data) => {
    if (err) {
      errorHandler(err);
    } else {
      const cssData = data.concat(css);
      const writer = fs.createWriteStream(
        path.join(__dirname, pathToDir, 'bundle.css')
      );

      writer.on('error', errorHandler);
      writer.write(cssData);
      writer.end();
    }
  });
}

commander
  .option('-a, --action', 'run an action')
  .option('-f, --file', 'set path to a file')
  .option('-p, --path', 'path to a directory used by cssBuilder')
  .action((action, file) => {
    switch (action) {
      case 'reverse': {
        reverse();
        break;
      }
      case 'transform': {
        transform();
        break;
      }
      case 'outputFile': {
        if (!commander.file) {
          printHelpMessage();
          break;
        }
        outputFile(file);
        break;
      }
      case 'convertFromFile': {
        if (!commander.file) {
          printHelpMessage();
          break;
        }
        convertFromFile(file);
        break;
      }
      case 'convertToFile': {
        if (!commander.file) {
          printHelpMessage();
          break;
        }
        convertToFile(file);
        break;
      }
      case 'cssBuilder': {
        if (!commander.path) {
          printHelpMessage();
          break;
        }
        cssBuilder(file);
        break;
      }
      default:
        printHelpMessage();
    }
  })
  .parse(process.argv);

if (!commander.args.length) printHelpMessage();
