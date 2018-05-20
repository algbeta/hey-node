const through = require('through2');
const commander = require('commander');
const fs = require('fs');
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
      process.exit();
    }
  });
}

/**
 *  transform implemenation
 */
function write(buffer, encoding, next) {
  if (buffer) {
    const data = buffer.toString();
    this.push(`data: ${data.toUpperCase()}`);
  }
  next();
}
function end(done) {
  done();
  process.exit();
}

function transform() {
  const stream = through(write, end);
  process.stdout.write('Please, enter a string: ');
  process.stdin.pipe(stream).pipe(process.stdout);
}
/**
 * outputFile implementation
 * @param {string} filePath
 */
function outputFile(filePath) {
  const reader = fs.createReadStream(filePath);
  reader.pipe(process.stdout);
}

function convertFromFile(filePath) {}
function convertToFile(filePath) {}

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
      default:
        printHelpMessage();
    }
  })
  .parse(process.argv);

if (!commander.args.length) printHelpMessage();
