const config = require("config");
const JWT = require("jsonwebtoken");

//CKECK IF HE IS LOGIN

// this function will be used to check if the current user have been authentificated or not, by
// cheking the validation of the token, if yes it will save it's info in body.user (paylod)

function authorisation(req, res, next) {
  // getting the token (we entered in the users.js) from the header
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, No token found !");

  try {
    // getting the paylod from the token
    const paylod = JWT.verify(token, config.get("jwtPrivateKey"));
    req.user = paylod;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token found !");
  }
}

module.exports = authorisation;
