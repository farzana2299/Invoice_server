const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers['access_token'];
    // console.log("all headers",req.headers);
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);
    if (!token) {
        return res.status(401).json("Authorization Failed! Token not provided");
    }
    try {
        const jwtResponse = jwt.verify(token, "superkey123");
        req.payload = jwtResponse._id;
        next();
    } catch (err) {
        return res.status(401).json("Authorization Failed! Invalid token");
    }
}

module.exports = jwtMiddleware;

