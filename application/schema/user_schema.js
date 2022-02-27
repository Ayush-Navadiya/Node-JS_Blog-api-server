let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user_schema = Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    updated_date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        required: false
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    is_deleted: {
        type: Number,
        default: 0
    },
    role_id: {
         type: Number,
        required: true,
         default: 2
    }
}, {collection: 'user_master'});

let User = module.exports = mongoose.model('webin.user_master', user_schema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
};
