require('http')
  .createServer()
  .on('request', (req, res) => {
    res.writeHead(200);
    req.pipe(res);
  })
  .listen(3000);
