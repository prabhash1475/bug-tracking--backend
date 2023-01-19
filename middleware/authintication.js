const jwt = require("jsonwebtoken");

const authinticate = (req, res, next) => {
  const token = req.headers?.authinticate?.split(" "[1]);

  if (token) {
    const decode = jwt.verify(token, "masai");
    if (decode) {
      const userID = decode.userID;

      req.body.userID = userID;

      next();
    } else {
      res.send({ msg: "Login again" });
    }
  } else {
    res.send({ msg: "login again" });
  }
};

module.exports = {
  authinticate,
};
