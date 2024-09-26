const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log("Verifying token"); 
    const token = req.cookies.token;
    
    // Check if token is present
    if (!token) {
        console,log("Token not found");
        return res.status(401).json("You are not authenticated!");
    }
    
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            console.log("Token verification failed");
            return res.status(403).json("Token is not valid!");
        }
        console.log("Token verified successfully");
        // Attach user ID to request object and proceed
        req.userId = data._id;
        // console.log("Token verified successfully");
        next();
    });
};

module.exports = verifyToken;
