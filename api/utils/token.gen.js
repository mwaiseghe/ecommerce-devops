const jwt = require('jsonwebtoken')

const maxAge = 24 * 60 * 60

module.exports.createToken = (payload)=>{
    return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: maxAge
    })
}