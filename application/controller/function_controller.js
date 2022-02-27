let mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var multer  = require('multer');
let Blog = require('../schema/blog_schema');
let User = require('../schema/user_schema');
let fs = require('fs');
const {exec} = require("child_process");
let Log = require('../model/log_model');
var base64Img = require('base64-img');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
});
const upload = multer({
    storage: storage
}).any();



// const ustorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/userimg/")
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
//     }
// });
// const userupload = multer({
//     storage: ustorage
// }).any();







exports.createuser = async (req, res) => {
    try {
                if (req.body.fnc == "edit") {

                    User.findById(req.body.id, (err, user) => {
                        if (!err) {
                            user.fname = req.body.cfname;
                            user.lname = req.body.clname;
                            user.email_id = req.body.cemail;
                            user.mobile_no = req.body.cmno;
                            user.location = req.body.ccity;
                            user.address = req.body.caddress;
                            user.gender = req.body.cgender;
                            user.password = req.body.cpassword;
                            user.image = req.body.imgpath;
                            console.log(req.body);


                            base64Img.img(user.image, './public/userimg/', user.email_id, function (err, filepath) {
                                if (!err) {
                                    console.log("imgsaved");
                                    user.image = filepath;
                                    console.log("filepath" + user.image);
                                }
                            });

                            user.save((err) => {
                                if (!err) {
                                    res.json({
                                        status: 'success',
                                        message: 'Account successfully Edited!',
                                        data: user,
                                    })
                                    let log_title = 'User Edited';
                                    let log_desc = 'User <b>' + user.fname + ' ' + user.lname + '</b> was Edited';
                                    Log.recordLog('Edit user', 'Edit user', log_title, log_desc);
                                } else {
                                    res.json({
                                        status: 'error',
                                        message: 'Account failed to Create! Contact administration!',
                                        data: err
                                    })
                                }
                            })
                        }
                    })
                } else if (req.body.fnc == "create") {
                    let user = new User;
                    user.role_id = 3;
                    user.fname = req.body.cfname;
                    user.lname = req.body.clname;
                    user.email_id = req.body.cemail;
                    user.mobile_no = req.body.cmno;
                    user.location = req.body.ccity;
                    user.address = req.body.caddress;
                    user.gender = req.body.cgender;
                    user.password = req.body.cpassword;
                    user.image = req.body.imgpath;
                    console.log(req.body);


                    base64Img.img(user.image, './public/userimg/', user.email_id, function (err, filepath) {
                        if (!err) {
                            console.log("imgsaved");
                            user.image = filepath;
                            console.log("filepath" + user.image);
                        }
                    });


                    user.save((err) => {
                        if (!err) {
                            res.json({
                                status: 'success',
                                message: 'Account successfully created!',
                                data: user,
                            })
                            let log_title = 'User created';
                            let log_desc = 'User <b>' + user.fname + ' ' + user.lname + '</b> was created';
                            Log.recordLog('Create user', 'Create user', log_title, log_desc);
                        } else {
                            res.json({
                                status: 'error',
                                message: 'Account failed to Create! Contact administration!',
                                data: err
                            })
                        }
                    })
                }
        } catch (err) {
            res.json({
                status: 'error upload',
                message: err.message,
                error: err,
            })
        }
};


exports.userd = (req, res, next) => {
    const pipelines = [];
    const draw = req.body.draw;
    const order = req.body.order;
    const start = req.body.start;
    const length = req.body.length;
    const search = req.body.search;

    let valid_col = [];
    valid_col[0] = '_id';
    valid_col[1] = 'fname';
    valid_col[2] = 'image';
    valid_col[3] = 'created_date';
    valid_col[4] = 'status';
    valid_col[5] = '_id';

    let order_col = order[0]['column'];
    let order_dir = order[0]['dir'];
    if (order_dir === 'asc') {
        order_dir = 1;
    } else {
        order_dir = -1;
    }
    pipelines.push({
        $match: {
            'is_deleted': 0,
        }
    });

    let sort = {};
    sort[valid_col[order_col]] = order_dir;
    pipelines.push({
        $sort: sort
    });
    if (search.value !== '') {
        let search_tx = [];
        for (let x = 0; x < valid_col.length; x++) {
            let search_ele = {};
            search_ele['$regex'] = search.value;
            search_ele['$options'] = 'i';
            let search_ele2 = {};
            search_ele2[valid_col[x]] = search_ele;
            search_tx.push(search_ele2);
        }
        pipelines.push({
            $match: {
                $or: search_tx
            }
        });
    }
    const aggr_array_data = [];
    const aggr_array_total = [];

    for (let i = 0; i < pipelines.length; i++) {
        aggr_array_data.push(pipelines[i]);
        aggr_array_total.push(pipelines[i]);
    }

    aggr_array_data.push({
        $skip: parseInt(start)
    });
    aggr_array_data.push({
        $limit: parseInt(length)
    });

    let facet_aggr_array = [
        {
            $facet: {
                "data_set": aggr_array_data,
                "data_total": aggr_array_total,
            }
        }
    ];

    User.aggregate(facet_aggr_array).exec(function (err, user) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else {
            res.json({
                status: "success",
                message: "Data retrieved successfully",
                data: user[0].data_set,
                draw: draw,
                recordsTotal: user[0].data_total.length,
                recordsFiltered: user[0].data_total.length,
            });
        }
    });
};


exports.createb = async (req, res) => {
    try{
        upload(req, res, async (err) => {
            try {
                if (!err) {
                    let blog = new Blog;
                    blog.title = req.body.btitle;
                    blog.short_des = req.body.shortdes;
                    blog.des = req.body.des;
                    blog.meta_title = req.body.mtitle;
                    blog.meta_keyword = req.body.mkeyword;
                    blog.meta_desc = req.body.mdescription;
                    blog.seo_url = req.body.seo_url;
                    let image = req.files.inpFile;
                    blog.image = "/images/" + req.files[0].filename;
                    console.log(req.files);
                    console.log(req.body);
                    console.log("image uploaded");

                    blog.save((err) => {
                        if (!err) {
                            res.json({
                                status: 'success',
                                message: 'Blog Created Successfully!',
                                data: blog
                            })
                        } else {
                            res.json({
                                status: 'error',
                                message: 'Blog Creation Failed! Contact administration!',
                                data: err
                            })
                        }
                    })

                } else {
                    res.json({
                        status: 'error file',
                        message: 'Error in file upload!',
                        error: err
                    })
                }
            } catch (err) {
                res.json({
                    status: 'error upload',
                    message: err.message,
                    error: err,
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error try',
            message: e.message
        })
    }
};


exports.postd = (req, res, next) => {
    const pipelines = [];
    const draw = req.body.draw;
    const order = req.body.order;
    const start = req.body.start;
    const length = req.body.length;
    const search = req.body.search;

    let valid_col = [];
    valid_col[0] = '_id';
    valid_col[1] = 'title';
    valid_col[2] = 'image';
    valid_col[3] = 'created_date';
    valid_col[4] = 'status';
    valid_col[5] = '_id';

    let order_col = order[0]['column'];
    let order_dir = order[0]['dir'];
    if (order_dir === 'asc') {
        order_dir = 1;
    } else {
        order_dir = -1;
    }
    pipelines.push({
        $match: {
            'is_deleted': 0,
        }
    });

    let sort = {};
    sort[valid_col[order_col]] = order_dir;
    pipelines.push({
        $sort: sort
    });
    if (search.value !== '') {
        let search_tx = [];
        for (let x = 0; x < valid_col.length; x++) {
            let search_ele = {};
            search_ele['$regex'] = search.value;
            search_ele['$options'] = 'i';
            let search_ele2 = {};
            search_ele2[valid_col[x]] = search_ele;
            search_tx.push(search_ele2);
        }
        pipelines.push({
            $match: {
                $or: search_tx
            }
        });
    }
    const aggr_array_data = [];
    const aggr_array_total = [];

    for (let i = 0; i < pipelines.length; i++) {
        aggr_array_data.push(pipelines[i]);
        aggr_array_total.push(pipelines[i]);
    }

    aggr_array_data.push({
        $skip: parseInt(start)
    });
    aggr_array_data.push({
        $limit: parseInt(length)
    });

    let facet_aggr_array = [
        {
            $facet: {
                "data_set": aggr_array_data,
                "data_total": aggr_array_total,
            }
        }
    ];

    Blog.aggregate(facet_aggr_array).exec(function (err, blog) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else {
            res.json({
                status: "success",
                message: "Data retrieved successfully",
                data: blog[0].data_set,
                draw: draw,
                recordsTotal: blog[0].data_total.length,
                recordsFiltered: blog[0].data_total.length,
            });
        }
    });
};


exports.blogedit = async (req, res) => {
    try {
            upload(req, res, async (err) => {
                try {
                    Blog.findById(req.body.bid, (err, blog) => {
                        blog.title = req.body.btitle;
                        blog.short_des = req.body.shortdes;
                        blog.des = req.body.des;
                        blog.meta_title = req.body.mtitle;
                        blog.meta_keyword = req.body.mkeyword;
                        blog.meta_desc = req.body.mdescription;
                        blog.seo_url = req.body.seo_url;
                        try{
                            let image = req.files.inpFile;
                            blog.image = "/images/" + req.files[0].filename;
                        } catch {
                            console.log("Image not changed");
                        }
                        console.log(req.files);
                        console.log(req.body);
                        console.log("image uploaded");

                        blog.save((err) => {
                            if (!err) {
                                res.json({
                                    status: 'success',
                                    message: 'Blog Edited Successfully!',
                                    data: blog
                                })
                            } else {
                                res.json({
                                    status: 'error',
                                    message: 'Blog editing Failed! Contact administration!',
                                    data: err
                                })
                            }
                        })
                    })
                } catch {
                    console.log("error img upload edit")
                }
            })
            } catch (e) {
                res.json({
                    status: 'error',
                    message: e.message
                })
            }

};


exports.userdelete = (req, res, next) => {
    try {
        User.findById(req.query._id, (err, user) => {
            if (!err) {
                user.is_deleted = 1;
                user.save((err) => {
                    if (!err) {
                        //let page_data = {};
                        //page_data.title = 'Posts - webin';
                        // page_data.script_tag = [];
                        // page_data.script_tag.push('/scripts/signup.js');
                        res.redirect('../../userlist');
                    } else {
                        res.json({
                            status: 'error',
                            message: err
                        })
                    }
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};


exports.blogdelete = (req, res, next) => {
    try {
        Blog.findById(req.body.id, (err, blog) => {
            if (!err) {
                blog.is_deleted = 1;
                blog.save((err) => {
                    if (!err) {
                        res.json({
                            status: 'success',
                            message: 'blog deleted'
                        })
                    } else {
                        res.json({
                            status: 'error',
                            message: err
                        })
                    }
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};


exports.blogdata = (req, res, next) => {
    try {
        Blog.findById(req.body.id, (err, blog) => {
            if (!err) {
                blog.save((err) => {
                    if (!err) {
                        res.json({
                            status: 'success',
                            message: err,
                            data: blog
                        })
                    } else {
                        res.json({
                            status: 'error',
                            message: err
                        })
                    }
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};


exports.blogstatus = (req, res, next) => {
    try {
        Blog.findById(req.body.id, (err, blog) => {
            if (!err) {
                status = blog.status;
                if(status == 1)
                {
                    blog.status = 0;
                }
                else
                {
                    blog.status = 1;
                }
                blog.save((err) => {
                    if (!err) {
                        res.json({
                            status: 'success',
                            message: 'stuatus updated'
                        })
                    } else {
                        res.json({
                            status: 'error',
                            message: err
                        })
                    }
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};


exports.userstatus = (req, res, next) => {
    try {
        User.findById(req.body.id, (err, user) => {
            if (!err) {
                status = user.status;
                if(status == 1)
                {
                    user.status = 0;
                }
                else
                {
                    user.status = 1;
                }
                user.save((err) => {
                    if (!err) {
                        res.json({
                            status: 'Success',
                            message: "Status Updated"
                        })
                    } else {
                        res.json({
                            status: 'error',
                            message: err
                        })
                    }
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};