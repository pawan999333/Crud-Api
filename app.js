const express=require('express')
const Sequelize=require('sequelize')
const bcrypt=require('bcrypt')

const bodyParser=require('body-parser')

const JWT=require('jsonwebtoken')
const JwtConfig=require('./config/jwt-config')
const jwtConfig = require('./config/jwt-config')


const jwtMiddleware=require('./config/jwt-middleware')

const app=express()
const PORT=3021;
app.use(bodyParser.json())


//database connection

const sequelize=new Sequelize("jwttoken",'root','codefire', {
    host:"localhost",
    dialect:"mysql"
})


sequelize.authenticate().then((data)=>{
    console.log("database connected")

}).catch((error)=>{
    console.log(error)
})

// add model table
const User=sequelize.define('tbl_users',{
    id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
},

name:{
    type:Sequelize.STRING(50),
    allowNull:false
},

email:{
    type:Sequelize.STRING(50),
    allowNull:false
},
password:{
    type:Sequelize.STRING(150),
    allowNull:false
},

status:{
    type:Sequelize.INTEGER,
    defaultValue:1
}

}, {
    timestamps:false,
    modelName:"User"
});



User.sync();




// User profile data
app.post('/profile', jwtMiddleware.checkToken,(req,res)=>{
    res.status(200).json({
        status:1,
        userdata:req.user,
        message:"token value parser"
    })
})

// validation of token
app.post('/validate', (req,res) => {
    // console.log(req.headers)
    let userToken=req.headers["authorization"]

    if(userToken){
        // we have token
        JWT.verify(userToken, JwtConfig.secret, (error, decoded) => {
            if(error){
                // console.log(error);
                res.status(500).json({
                    status:0,
                    message:"Invalid token",
                    data:error
                });
            }else{
                // console.log(decoded);
                res.status(200).json({
                    status:1,
                    message:"token is valid",
                    data:decoded
                })
            }
        })
    }
    else{
        // not getting token
        res.status(500).json({
            status:0,
            message:"please provide authonitication token value"
        })
    }
})

// login user api

app.post("/login", (req,res)=>{

    User.findOne({
        where:{
            email:req.body.email,
           
        }
    }).then((user)=>{
        if(user){
            if(bcrypt.compareSync(req.body.password,user.password)){
                let userToken=JWT.sign({
                    email:user.email,
                    id:user.id
                }, 
                // "onlinewebtutorkey", {
                //     expiresIn:600000,
                //     notBefore:60000,
                //     audience:"site-users"
                // }

                JwtConfig.secret, {
                    expiresIn:JwtConfig.expiresIn,
                    notBefore:jwtConfig.notBefore,
                    audience:jwtConfig.audience,
                    issuer:jwtConfig.issuer,
                    algorithm:jwtConfig.algorithm
                }

                )

                res.status(200).json({
                    status:1,
                    message:"user login successfully",
                    token:userToken
                })
            }else{
                res.status(500).json({
                    status:0,
                    message:"password didn't match"
                })
            }
        }

        else{
            res.status(500).json({
                status:0,
                message:"user does not exists with this email address"
            })
        }
    }).catch((error)=>{
        console.log(error);
    })
})

// register user api

app.post("/user",(req,res)=>{
    let name=req.body.name;
    let password=bcrypt.hashSync(req.body.password, 10); //hash value
    let email=req.body.email;
    let status=req.body.status;


    User.findOne({
        where:{
            email:email
        }
    }).then((user)=>{

        if(user){
                res.status(200).json({
                    status:0,
                    message:"user already exists"
                })
        }
        else{

            User.create({
                name:name,
                email:email,
                password:password,
                status:status
            }).then((response)=>{
                res.status(200).json({
                    status:1,
                    message:"user has been registerd successfully"
                });
            }).catch((error)=>{
                res.status(500).json({
                    status:0,
                    data:error
                    
                })
            })
        }

    }).catch((error)=>{
        console.log(error)
    })
   
   
   
   
    // User.create({
    //     name:name,
    //     email:email,
    //     password:password,
    //     status:status
    // }).then((response)=>{
    //     res.status(200).json({
    //         status:1,
    //         message:"user has been registerd successfully"
    //     });
    // }).catch((error)=>{
    //     res.status(500).json({
    //         status:0,
    //         data:error
    //     })
    // })
})

//default route
app.get('/',(req,res) => {

    res.status(200).json({
        status:1,
        message:"welcome"
    })
})

app.listen(PORT, ()=>{
    console.log("app is running")
})