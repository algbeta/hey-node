const commander = require('commander');
const through = require('through2');
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
}

function transform() {
  const stream = through(write, end);
  process.stdout.write('Please, enter a string: ');
  process.stdin.pipe(stream).pipe(process.stdout);
}

function outputFile(filePath) {}
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
    if (!action) {
      printHelpMessage();
    }

    switch (action) {
      case 'reverse': {
        reverse();
        break;
      }
      case 'transform': {
        transform();
        break;
      }
      default:
        printHelpMessage();
    }
  })
  .parse(process.argv);

if (!commander.args.length) printHelpMessage();
