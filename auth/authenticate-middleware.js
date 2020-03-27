/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const secret = 'keep it secret!';

  if (authorization) {
    jwt.verify(authorization, secret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: "Invalid credentials" })
      } else {
        req.decodedToken = decodedToken;
        next();
      }//end if/else error
    });
  } else {
    res.status(401).json({ you: 'shall not pass!' });
  }

};
