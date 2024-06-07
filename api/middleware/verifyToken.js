import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

     // because the token is stored in a cookie || this is how we can retrive it 
     const token = req.cookies.token;

     if (!token) return res.status(401).json({ message: "Not Authenticated!" });

     jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
          if (err) return res.status(403).json({ message: "Token is not Valid!" });
          req.userId = payload.id;

          next();
     });
};