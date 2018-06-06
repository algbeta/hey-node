const fs = require('fs');
const path = require('path');

require('http')
  .createServer()
  .on('request', (req, res) => {
    try {
      const data = fs.readFileSync(path.join(__dirname, 'index.html'));
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(data);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader = 'text/plain';
      res.statusMessage = 'An error occurred!';
      res.end();
    }
  })
  .listen(3000);
