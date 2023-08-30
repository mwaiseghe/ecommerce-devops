// signup and signin controller

const mssql = require('mssql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4 } = require('uuid')
const { sqlConfig } = require('../Config/Config')
const { hashPassword } = require('../utils/hashedpwd')
const { createToken } = require('../utils/token.gen')
const { registrationSchema, loginSchema } = require('../Validators/Auth.validators')

const customeregister = async (req, res) => {
    try{
        const id = v4()
        const { firstName, lastName, email, password } = req.body
        if (!firstName || !lastName || !email || !password){
            return res.status(400).json({error: 'Please input all values'})
        }
        const { error } = registrationSchema.validate({ firstName, lastName, email, password })
        if(error){
            return res.status(422).json({error: error.details})
        }
        const pool = await mssql.connect(sqlConfig)
        const checkEmailQuery = await pool
        .request()
        .input('email', email)
        .execute('fetchUserByEmailPROC')
        if(checkEmailQuery.rowsAffected[0] == 1){
            return res.status(400).json({error: 'Account creation failed! This email is already registered'})   
        }

        const hashedPwd = await bcrypt.hash(password, 5)

        // const pool = await mssql.connect(sqlConfig)
        await pool.request()
        .input('id', id)
        .input('first_name', mssql.VarChar, firstName)
        .input('last_name', mssql.VarChar, lastName)
        .input('email', mssql.VarChar, email)
        .input('password', mssql.VarChar, hashedPwd)
        .execute('createNewUserPROC')
        
        // const token = jwt.sign({email, is_admin: 0}, process.env.SECRET_KEY, {  expiresIn: 24*60*60 })  
        return res.status(201).json({message: 'Account created successfully'})
       
    } catch(error){
        return res.status(500).json({error: `Internal server error, ${error.message}`})
    }
}


const login = async (req, res) => {
    try {
        if(!req.body){
            return res.status(400).json({error: 'The request body can not be empty'})
        }
        const { email, password } = req.body
        const { error } = loginSchema.validate({ email, password })
        if(error){
            return res.status(422).json({error: error.message})
        } else {
            // check if email is registered
            const pool = await mssql.connect(sqlConfig)
            const checkEmailQuery = await pool
            .request()
            .input('email', email)
            .execute('fetchUserByEmailPROC')

            if(checkEmailQuery.rowsAffected[0] == 0){
                return res.status(400).json({error: 'This email is not registered'})
            } else if(checkEmailQuery.recordset[0].is_deleted){
                return res.status(403).json({error: 'This account has been deactivated'})
            } else {
                const valid = await bcrypt.compare(password, checkEmailQuery.recordset[0].password)
                if(valid){
                    const token = jwt.sign({email: checkEmailQuery.recordset[0].email, is_admin: checkEmailQuery.recordset[0].is_admin}, process.env.SECRET_KEY, {
                        expiresIn: 24*60*60
                    })
                    const {password, is_verified, is_assigned, ...user} = checkEmailQuery.recordset[0]
                    return res.status(200).json({message: 'Login successful', token, user})
                } else {
                    return res.status(400).json({error: 'Invalid login credentials'})
                }
            }
        }
    } catch(error){
        console.log(error);
        return res.status(500).json({error: `Internal server error, ${error.message}`})
    }
}

const adminregister = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const { error } = registrationSchema.validate({ firstName, lastName, email, password })
    if (error) {
        return res.status(400).json({error: error.message})
    } else {
        mssql .connect(sqlConfig).then(pool => {
            return pool.request()
            .input('email', email)
            .execute('fetchUserByEmailPROC')
        }) .then(result => {
            if(result.rowsAffected[0] == 1){
                return res.status(400).json({error: 'Account creation failed! This email is already registered'})
            } else{
                hashPassword(password).then(hashedPwd => {
                    mssql.connect(sqlConfig).then(pool => {
                        return pool.request()
                        .input('first_name', firstName)
                        .input('last_name', lastName)
                        .input('email', email)
                        .input('password', hashedPwd)
                        .execute('createNewUserPROC')
                    }).then(result => {
                        const token = jwt.sign({email: result.recordset[0].email, is_admin: result.recordset[0].is_admin}, process.env.SECRET_KEY, {
                            expiresIn: 24*60*60
                        })
                        res.status(201).json({message: 'Account created successfully', token, user: {firstName, lastName, email, is_admin: 1}})

                    }).catch(error => {
                        return res.status(500).json({error: error.message})
                    }) 
                    })
                }
        })
    }
}     

module.exports = {
    customeregister,
    login,
    adminregister
} 