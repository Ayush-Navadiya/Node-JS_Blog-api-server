let mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let User = require('../schema/user.schema');

async function isLogin(authId) {
    let response = false;
    await User.findById(authId, (err, user) => {
        if (!err) {
            if (user === null) {
                response = false;
            } else {
                if (parseInt(user.status) !== 1) {
                    response = false;
                } else {
                    response = true;
                }
            }
        } else {
            response = false;
        }
    });
    return response;
}

module.exports = {
    isLogin: isLogin,
};