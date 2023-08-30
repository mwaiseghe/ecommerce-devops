const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({error: 'Unauthorized'})
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedToken;
        next();
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
}

const user_is_admin = (req, res, next) => {
    try {
        if(req.user.is_admin){
            next();
        } else {
            return res.status(403).json({error: 'Forbidden'})
        }
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
}

module.exports = { verifyToken, user_is_admin }
    