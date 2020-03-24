const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied " });
  }
  let tokenstr =config.get('jwtSecret');

  //verify token
  try {
    const decoded = jwt.verify(token, tokenstr);
    req.user = decoded.user;
    next();
  } catch (error) {

    res.status('401').json({msg:'token is not valid '});
  }
};
