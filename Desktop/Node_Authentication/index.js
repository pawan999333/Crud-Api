var express=require('express');
var app=express();
var mysql=require('mysql')

var bodyParser=require('body-parser')
var session=require('express-session');


app.use(function(req,res,next){
    res.set('Cache-Control','no-cache,private,must-revalidate,no-store');
    next();
})


app.use(session({

    secret:'secret',
    resave: true,
    saveUninitialized:true
}))



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'codefire',
    database:'node_auth'
})



conn.connect(function(err){
    
    if(err) throw err;

    console.log("connected!...")
})


app.set('view engine','ejs')



app.get('/',function(req,res){
    // res.send("<h1>hello world</h1>")
    res.render('signup')
})

app.post('/signup', function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;


    var sql=`insert into users(user_name,user_email,user_password) values('${name}', '${email}', '${password}')`;

    conn.query(sql,function(err,result){

        if(err) throw err;

        res.send("<h1>User successfully register...</h1>");

    });

});

app.get('/login', function(req,res){
    res.render('login');
})


app.post('/login',function(req,res){
    
    var email=req.body.email;
    var password=req.body.password;


    if(email && password){

        var sql=`select * from users where user_email='${email}' && user_password='${password}'`;
        
        conn.query(sql,function(err,results){
            if(results.length){

                req.session.loggedin=true;
                req.session.email=email;
                res.redirect('/welcome');

            }else{
                res.send("<h1>Incorrect email or password!</h1>")
            }
        })

    }else{
        res.send("<h1>Please enter email or password</h1>")
    }
})

app.get('/welcome',function(req,res){

    if(req.session.loggedin){

        res.render('welcome', {user:`${req.session.email}`})
    }else{
        res.send("<h1>Please login to view this page...</h1>");
    }

})



app.get('/logout',function(req,res){
    req.session.destroy((err)=>{
        res.redirect('/login')

    })
});


var server=app.listen(3330,function(){
    console.log("Go to port number 3330");
})