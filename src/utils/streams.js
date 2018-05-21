const through = require('through2');
const path = require('path');
const commander = require('commander');
const fs = require('fs');
const csvjson = require('csvjson');

/**
 * reverse implementation
 * reads console input
 * logs reversed console input
 */
function reverse() {
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  process.stdout.write('Please, enter a string: ');

  process.stdin.once('data', data => {
    if (data !== null) {
      const finalData = data
        .toString()
        .trim()
        .split('')
        .reverse()
        .join('');
      process.stdout.write(`data: ${finalData}`);
      process.stdin.end();
    }
  });
}

/**
 *  transform implemenation
 */
function write(buffer, enconding) {
  if (buffer) {
    const data = buffer.toString(enconding);
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
  process.stdin.pipe(stream).pipe(process.stdout);
}
/**
 * outputFile implementation
 * @param {string} file: name of file to be displayed in console
 */
function outputFile(file) {
  const reader = fs.createReadStream(file);
  reader.pipe(process.stdout);
}
/**
 * convertFromFile implementation
 * @param {string} file: name of csv file to be displayed in console
 */
function convertFromFile(file) {
  const reader = fs.createReadStream(path.join(__dirname, file));
  const toObject = csvjson.stream.toObject();
  var stringify = csvjson.stream.stringify();
  reader.pipe(toObject).pipe(stringify).pipe(process.stdout);
}
/**
 * convertToFile
 * @param {string} file : name of csv file to be saved to json
 */
function convertToFile(file) {
  const reader = fs.createReadStream(path.join(__dirname, file));
  const jsonName = file.replace('.csv', '');
  const writer = fs.createWriteStream(path.join(__dirname, `${jsonName}.json`));
  const toObject = csvjson.stream.toObject();
  const stringify = csvjson.stream.stringify();
  reader.pipe(toObject).pipe(stringify).pipe(writer);
}

function printHelpMessage() {
  console.log('[ERROR] incorrect input');
  commander.help();
}

commander
  .option('-a, --action', 'run an action')
  .option('-f, --file', 'set path to a file')
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
        outputFile(file);
        break;
      }
      case 'convertFromFile': {
        convertFromFile(file);
        break;
      }
      case 'convertToFile': {
        convertToFile(file);
        break;
      }
      default:
        printHelpMessage();
    }
  })
  .parse(process.argv);

if (!commander.args.length) printHelpMessage();
