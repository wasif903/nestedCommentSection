import Jwt from "jsonwebtoken";

const authMiddleware = (allowedRoles, allowedStatus) => {

  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json('UnAuthorized');
      }

      const decodedToken = Jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      const verifyRoles = decodedToken.roles;
      const verifyStatus = decodedToken.status;

      const checkRoles = allowedRoles ? allowedRoles.some(roles => verifyRoles.includes(roles)) : true;
      const checkStatus = allowedStatus ? allowedStatus.includes(verifyStatus) : true;

      if (!checkRoles) {
        return res.status(403).json('Forbidden');
      }

      if (!checkStatus) {
        return res.status(403).json('This User Is Blocked');
      }

      req.userId = decodedToken.id;
      req.userRole = decodedToken.roles;
      req.userStatus = decodedToken.status;

      return next();
    } catch (error) {
      console.log(error, 'middleware error');
      return res.status(500).json(error);
    }
  };
};

export default authMiddleware;
