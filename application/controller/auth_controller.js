let mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let User = require('../schema/user_schema');
let Log = require('../model/log_model');

exports.login_page = async (req, res, next) => {
    if(req.session.is_login) {
        let page_data = {};
        page_data.title = 'Dashboard- webin';
        //   page_data.script_tag = [];
        //   page_data.script_tag.push('/scripts/login.js');
        res.redirect('dashboard');
    }else{
        let page_data = {};
        page_data.title = 'Login - webin';
        //   page_data.script_tag = [];
        //   page_data.script_tag.push('/scripts/login.js');
        res.render('login', page_data);
    }
};


exports.signup_page = async (req, res, next) => {
    let page_data = {};
    page_data.title = 'Signup - webin';
   // page_data.script_tag = [];
   // page_data.script_tag.push('/scripts/signup.js');
    res.render('signup', page_data);
};


exports.dashboard_page = async (req, res, next) => {
    console.log(req.session);
    if(req.session.is_login) {
        let page_data = {};
        page_data.title = 'Dashboard- webin';
        //   page_data.script_tag = [];
        //   page_data.script_tag.push('/scripts/login.js');
        res.render('posts', page_data);
    }else{
        let page_data = {};
        page_data.title = 'Login - webin';
        res.redirect('/');
    }
};








exports.signup = async (req, res) => {
    console.log("Signup");
         try{
            let user = new User;
            user.role_id = 3;
            user.fname = req.body.fname;
            user.lname = req.body.lname;
            user.email_id = req.body.email;
            user.mobile_no = req.body.mno;
            user.location = req.body.city;
            user.address = req.body.address;
            user.gender = req.body.gender;
            user.password = req.body.password;

            user.save((err) => {
                if (!err) {
                    console.log("Success");
                    res.json({
                        status: 'success',
                        message: 'Account successfully registered!',
                        data: user,
                    })
                    let log_title = 'User Signup';
                    let log_desc = 'User <b>' + user.fname + ' ' + user.lname + '</b> Signed Up';
                    Log.recordLog('Signup', 'Signup', log_title, log_desc);
                } else {
                    console.log(err);
                    res.json({
                        status: 'error',
                        message: 'Account failed to register! Contact administration!',
                        data: err
                    })
                }
            })
        } catch (e) {
             console.log(e);
             res.json({
                status: 'error',
                message: e.message
            })
         }
};


exports.login = async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let auth_where = {};
        auth_where.email_id = username;
        auth_where.password = password;
        User.findOne(auth_where, (err, user) => {
            if (!err) {
                if (user === null) {
                    res.json({
                        status: 'error',
                        message: "Invalid Email id and password!"
                    })
                } else {
                    if (parseInt(user.status) != 1) {
                        res.json({
                            status: 'error',
                            message: 'Your account is not ACTIVE!'
                        })
                    } else {
                        res.json({
                            status: 'success',
                            message: 'Login success!',
                            data: user
                        })

                        req.session.is_login = true;
                        req.session.auth_id = user['_id'];
                        req.session.account_data = user;
                        req.session.save();


                        let log_title = 'User Login';
                        let log_desc = 'User <b>' + user.fname + ' ' + user.lname + '</b> Loggedin Up';
                        Log.recordLog('Login', 'Login', log_title, log_desc);
                    }
                }
            } else {
                res.json({
                    status: 'error',
                    message: 'Something went wrong!',
                    data: err
                })
            }
        });
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message,
        })
    }
};


exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
};