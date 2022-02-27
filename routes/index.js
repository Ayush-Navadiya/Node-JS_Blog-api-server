var express = require('express');
var router = express.Router();


let auth_controller = require('../application/controller/auth_controller');
let view_controller = require('../application/controller/view_controller');

router.route('/').get(auth_controller.login_page);
router.route('/scripts').get(auth_controller.login_page);
router.route('/signup').get(auth_controller.signup_page);
router.route('/logout').get(auth_controller.logout);

router.route('/Bloged_display').get(view_controller.editblog_page);
router.route('/dashboard').get(auth_controller.dashboard_page);
router.route('/createblog').get(view_controller.createblog_page);
router.route('/postblog').get(view_controller.postblog_page);
router.route('/userlist').get(view_controller.userlist_page);
router.route('/createuser').get(view_controller.createuser_page);
router.route('/edituser').get(view_controller.edituser_page);

router.route('/view').get(view_controller.view_page);
router.route('/viewframe7').get(view_controller.view_pageframework7);


router.route('/dispblog').get(view_controller.disp_page);

module.exports = router;
