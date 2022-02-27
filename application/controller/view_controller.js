let mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let Blog = require('../schema/blog_schema');
let User = require('../schema/user_schema');


exports.view_page = async (req, res, next) => {
    const blog = await Blog.find({})
    res.render('viewlist', {blog});
};


exports.view_pageframework7 = async (req, res, next) => {
    const blog = await Blog.find({})
    res.json({
        status: 'success',
        message: 'Account successfully created!',
        data: blog,
    });
};


exports.createblog_page = async (req, res, next) => {
    if(req.session.is_login) {
        let page_data = {};
        page_data.title = 'Createblog - webin';
        // page_data.script_tag = [];
        // page_data.script_tag.push('/scripts/signup.js');
        res.render('createblog', page_data);
    }else{
        let page_data = {};
        page_data.title = 'Login - webin';
        res.redirect('/');
    }
};


exports.createuser_page = async (req, res, next) => {
    if(req.session.is_login) {
        let page_data = {};
        page_data.title = 'Create User';
        page_data.btn = 'Create User';
        page_data.fnc = 'create'
        // page_data.script_tag = [];
        // page_data.script_tag.push('/scripts/signup.js');
        res.render('createuser', page_data);
    }else{
        let page_data = {};
        page_data.title = 'Login - webin';
        res.redirect('/');
    }
};


exports.edituser_page = async (req, res, next) => {
    if(req.session.is_login) {
        let page_data = await User.findById(req.query.id);
        page_data.title = "Edit blog";
        page_data.btn = "Edit User";
        page_data.fnc = "edit"
        console.log(page_data);
        res.render('createuser', page_data);
    }else{
        let page_data = {};
        page_data.title = 'Login - webin';
        res.redirect('/');
    }
};



exports.disp_page = async (req, res, next) => {
    const blog = await Blog.findById(req.query.id);
    res.render('view', blog);
};


exports.postblog_page = async (req, res, next) => {
    if(req.session.is_login) {
        let page_data = {};
        page_data.title = 'Posts - webin';
        let blog_data = {};
        blog_data.title = '';
        // page_data.script_tag = [];
        // page_data.script_tag.push('/scripts/signup.js');
        res.render('posts', page_data);
    }else{
        let page_data = {};
        page_data.title = 'Login - webin';
        res.redirect('/');
    }

};


exports.userlist_page = async (req, res, next) => {
    if(req.session.is_login) {
        let page_data = {};
        page_data.title = 'Users - webin';
        let blog_data = {};
        blog_data.title = '';
        // page_data.script_tag = [];
        // page_data.script_tag.push('/scripts/signup.js');
        res.render('users', page_data);
    }else{
        let page_data = {};
        page_data.title = 'Login - webin';
        res.redirect('/');
    }

};


exports.editblog_page = async (req, res, next) => {
    if(req.session.is_login) {
        let page_data = {};
        page_data.title = 'Editblog - webin';
        // page_data.script_tag = [];
        // page_data.script_tag.push('/scripts/signup.js');
        res.render('editblog', page_data);
    }else{
        let page_data = {};
        page_data.title = 'Login - webin';
        res.redirect('/');
    }
};