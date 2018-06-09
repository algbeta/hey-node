const fs = require('fs');
const path = require('path');
const url = require('url');

require('http')
  .createServer()
  .on('request', (req, res) => {
    try {
      let data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      const urlObj = url.parse(req.url, true);
      if (urlObj && urlObj.query && urlObj.query.message) {
        data = data.replace('{message}', urlObj.query.message);
      }
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
