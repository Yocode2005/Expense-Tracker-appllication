import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        toLowerCase : true
    },
    password: {
        type : String,
        required : true
    }
},{
    timestamps : true
})


// Hash password  just before saving the user
userSchema.pre("save", async function () {// do not use arrow function here to access 'this'
    if(!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password, 10) // salt rounds = 10
  
})

// Instance method to compare passwords so when user logs in we can verifying password
userSchema.methods.isPasswordCorrect = async function(password){ //we pass plain text password here
    return await bcrypt.compare(password, this.password) // this.password is hashed password stored in db
}


userSchema.methods.generateAccessToken = function(){  // custom instance method to generate access token with jwt
    return jwt.sign( // it takes payload, secret key, options
        { // payload
            _id: this._id, // this._id is the id of the user document
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET, // secret key
        { // options
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){ // custom instance method to generate refresh token with jwt which is used to get new access token
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)