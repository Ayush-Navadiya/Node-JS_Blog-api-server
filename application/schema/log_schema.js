let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let log_schema = Schema({
    type: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    log_title: {
        type: String,
        required: true
    },
    log_description: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    is_deleted: {
        type: Number,
        default: 0
    }
}, {collection: 'log_master'});

let Log = module.exports = mongoose.model('webin.log_master', log_schema);
module.exports.get = function (callback, limit) {
    Log.find(callback).limit(limit);
};