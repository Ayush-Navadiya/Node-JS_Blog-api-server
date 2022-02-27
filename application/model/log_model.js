let mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let Log = require('../schema/log_schema');

function recordLog(type, action, log_title, log_description) {
    let log = new Log;
    log.type = type;
    log.action = action;
    log.log_title = log_title;
    log.log_description = log_description;
    log.save();
}

module.exports = {
    recordLog: recordLog,
};