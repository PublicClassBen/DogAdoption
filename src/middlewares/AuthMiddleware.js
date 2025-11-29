import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(
      token,
      process.env.JSON_WEB_TOKEN_SECRET,
      (err, decodedToken) => {
        if (err) {
          throw new Error("Token verification failed");
        } else {
          // verification passed
          res.locals.userId = decodedToken.id;
          next();
        }
      }
    );
  } else {
    throw new Error("No token found");
  }
};

export default requireAuth;