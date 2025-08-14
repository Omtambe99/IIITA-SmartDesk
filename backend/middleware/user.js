const jwt = require('jsonwebtoken');
// const secretKey = 'sadadsa';  // It's better to move this to an environment variable for production
const secretKey = process.env.JWT_SECRET || "dev_secret_for_local";
const  Userauthenticate = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    const token = authHeader;

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);
        // Attach the email from the token to the request object
        req.email = decoded.email;
        req.role = decoded.role;
        req.name = decoded.name;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = Userauthenticate;