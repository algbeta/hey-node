const url = require('url');

function queryParser(req, res, next) {
  if (!req.parsedQuery) {
    next();
  }

  const parsedUrl = url.parse(req.url, true);

  if (!parsedUrl.query) {
    next();
  }

  res.parsedQuery = parsedUrl.query;
  next();
}

module.exports = queryParser;

