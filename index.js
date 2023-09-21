const express=require('express');
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const bodyParser = require('body-parser');
const authRoutes=require('./routes/authRoutes')
const {requireAuth,checkUser}=require('./middlewares/authmiddleware')




const app=express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.set('view engine','ejs')

const dbURi="mongodb://127.0.0.1:27017/jwtauth";


mongoose.connect(dbURi,{
    useNewurlParser:true,
})
.then((result)=>{
    console.log('mongodb connected')
    app.listen(3000,()=>{
        console.log('app is running')
    })
})
.catch((err)=>{
    console.log(err)
})

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.get('*',checkUser)


app.get('/', (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "secret", (err, decodedToken) => {
            if (err) {
                res.render('login');
            } else {
                res.render('login');
            }
        });
    } else {
        res.render('login');
    }
});

app.get('/dashboard',requireAuth,(req,res)=>{
    res.render('dashboard');
})

app.use(authRoutes);
