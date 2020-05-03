const 
    router = require('express').Router(),
    controller = require('./controller.js'),
    multerConfig = require('./utils/multerConfig.js');


/**
 * Render an HTML file on the route connection
 */
router.get('/', controller.chat);

/**
 * Send post parameters to controller function
 */
router.post('/', multerConfig.upload.single('uploadFile'), controller.login);

/**
 * The logout route will redirect to login once the destroy session has been done.
 */
router.get('/logout', controller.logout);

module.exports = {
    router : router,
    controllerDatabase : controller.database
};
