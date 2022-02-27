let express = require('express');
let router = express.Router();

let auth_controller = require('../application/controller/auth_controller.js');
let function_controller = require('../application/controller/function_controller.js');


router.route('/signup_click').post(auth_controller.signup);
router.route('/login_click').post(auth_controller.login);

router.route('/createuser_click').post(function_controller.createuser);



router.route('/create_click').post(function_controller.createb);
router.route('/postd_click').post(function_controller.postd);
router.route('/userd_click').post(function_controller.userd);
router.route('/Bloged_click').post(function_controller.blogedit);
router.route('/Blogdl_click').post(function_controller.blogdelete);
router.route('/Userdl_click').get(function_controller.userdelete);
router.route('/getdata_click').post(function_controller.blogdata);
router.route('/Blog_status').post(function_controller.blogstatus);
router.route('/User_status').post(function_controller.userstatus);



module.exports = router;