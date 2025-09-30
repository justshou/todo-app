import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  // Takes in token from index.html:254 to compare
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }

    req.userID = decoded.id;
    next();
  });
}

export default authMiddleware;
