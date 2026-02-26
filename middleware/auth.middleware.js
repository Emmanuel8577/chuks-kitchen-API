import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Add user object to the request
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied - Admin only" });
    }
};