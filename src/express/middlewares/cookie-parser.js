function cookieParser(req, res, next) {
  if (!req.parsedCookies) {
    next();
  }

  const cookies = req.headers.cookie;
  if (!cookies) {
    next();
  }

  const cookiesArray = cookies.split(';');
  const parsedCookies = {};
  cookiesArray.forEach(pair => {
    const keyvalue = pair.trim().split('=');
    parsedCookies[keyvalue[0]] = keyvalue[1];
  });
  res.parsedCookies = parsedCookies;
  next();
}

module.exports = cookieParser;

