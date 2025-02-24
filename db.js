import permissions from "../config/permissions.js";
import { getRolebyId } from "../models/role.model.js";
const roleMiddleware =  (requiredPermission) => {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data found" });
      }
  
      const userRoleInfo = await getRolebyId(req.user.role); // Extract role from JWT token
      const userRole = userRoleInfo.role_name;
      if (!permissions[userRole] || !permissions[userRole].includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden: You do not have permission" });
      }
  
      next(); // ✅ User has permission, proceed to the route
    };
  };
  
  export default roleMiddleware;
