require('http')
  .createServer()
  .on('request', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/plains'
    });
    res.end('Hello, World!');
  })
  .listen(3000);
