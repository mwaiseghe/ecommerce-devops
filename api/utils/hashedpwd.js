const bcrypt = require('bcrypt')

module.exports.hashPassword = (password) =>{
    return new Promise((resolve, reject)=>{
        bcrypt.genSalt(10)
        .then((salt)=>{
            bcrypt.hash(password, salt)
            .then((hashed)=>{
                resolve(hashed)
            })
            .catch((e)=>{
                reject(e)
            })
        })
        .catch((e)=>{
            reject(e)
        })
    })
}