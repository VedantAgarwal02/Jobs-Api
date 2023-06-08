const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema( {
    company : {
        type :String,
        required: [true, 'Please provide a company name'],
        maxlength:50
    },
    position : {
        type : String,
        required:[true, 'Please Job Position'],
        maxlength: 30
    },
    status : {
        type : String,
        enum : ['pending', 'interview', 'declined'],
        default : 'pending'
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required: [true, 'Please provide user']
    }
}, {timestamps:true});

module.exports = mongoose.model('Jobs', JobSchema);