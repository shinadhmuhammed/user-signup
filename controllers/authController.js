const User=require('../models/User')
const jwt=require('jsonwebtoken')
const maxAge=3*24*60*60


const createToken=(id)=>{
    return jwt.sign({id},'secret',{
        expiresIn:maxAge
    })
}




//controller actions
module.exports.signup_get=(req,res)=>{
    res.render('signup');
}

const handleErrors=(err)=>{
    console.log(err.message,err.code);
    let errors={
        email:'',
        password:''
    }

//email error
    if(err.message==='incorrect email'){
        errors.email='that email is not registered'
    }
//password error
    if(err.message==='incorrect password'){
        errors.email='that password is incorrect'
    }
//duplicate email error
    if(err.code===11000){
        errors.email='that email is already registered';
        return errors;
    }
    //validation error

    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path]=properties.message;
        });
    }
    return errors;
}



module.exports.signup_post=async(req,res)=>{    
    const {email,password}=req.body;
    try {
        const user=await User.create({
            email,password
        })
        const token=createToken(User._id)
        
        res.cookie('jwt',token,{httpOnly:true,maxage:maxAge})

        res.status(201).json({user:User._id})

    } catch (err) {
        console.log(err)
        const errors=handleErrors(err)
        res.status(400).json({errors})
    }
    
}

module.exports.logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1})
     res.redirect('/')
}
   
module.exports.login_get=(req,res)=>{
    res.render('login');
    res.clearCookie('jwt')
}


module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.login(email, password); 
      const token = createToken(user._id); // Corrected to use 'user._id'
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
      res.status(200).json({ user: user._id });
      
       
    } catch (err) {
      console.log(err);
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
};

  