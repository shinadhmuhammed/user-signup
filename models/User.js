const mongoose=require('mongoose')
const {isEmail}=require('validator')
const bcrypt=require('bcrypt')


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        lowercase:true,
        validate:[isEmail,"please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minlength:[4,"minimum length is 4 characters"]
    }
})

userSchema.pre('save',async function(next){
    //hash password
const salt=await bcrypt.genSalt()
this.password=await bcrypt.hash(this.password,salt)
  next()
})
userSchema.statics.login=async function(email,password){
    const User=await this.findOne({email})
    if(User){
        const auth=await bcrypt.compare(password,User.password)
        if(auth){
            return User
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email');
}


const User=mongoose.model('user',userSchema)
module.exports=User