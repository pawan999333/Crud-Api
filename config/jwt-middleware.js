const jwtConfig = require('./jwt-config')
const JwtConfig=require('./jwt-config')
const JWT = require('jsonwebtoken')


let checkToken= (req,res,next)=>{

    let userToken=req.headers["authorization"]

    if(userToken){
        // token value
        JWT.verify(userToken,jwtConfig.secret, {
            algorithm:jwtConfig.algorithm
        },(error,data)=>{
            if(error){
                return res.status(500).json({
                    status:0,
                    message: error.message,
                })
            }else{
                req.user=data;
                next();
            }
        })
    }
    else{
        res.status(500).json({
            status:0,
            message:"Please provide authentication token value"
        })
    }

}

module.exports={
    checkToken:checkToken
}