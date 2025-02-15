const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    const userRole = req.user.role; // Extract role from JWT token

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission" });
    }

    next(); // ✅ User is authorized, proceed to the route
  };
};

export default roleMiddleware;
