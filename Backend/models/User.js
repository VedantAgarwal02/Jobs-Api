const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema( {
    name : {
        type:String,
        required:[true, 'Please provide a name'],
        minlength : [3, 'Name field should contain atleast 3 characters.'],
        maxlength : [20, 'Name field cannot contain more than 20 characters.']
    },
    email : {
        type : String,
        required : [true, 'Please provide an email'],
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
        unique : [true, 'Email already in use']
    },
    password : {
        type:String,
        required:[true, 'Please provide a password'],
        minlength : [6, 'Password should contain atleast 6 characters.']
    },
} );

// hashing the password before storing in DB
UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(this.password, salt)
    this.password = hashedPass;
})

UserSchema.methods.createJWT = function() {
    return jwt.sign({userId:this._id, username:this.name}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME});
}

UserSchema.methods.comparePassword = async function(inputPassword) {
    const match = await bcrypt.compare(inputPassword, this.password);
    return match;
}

module.exports = mongoose.model('User', UserSchema);
