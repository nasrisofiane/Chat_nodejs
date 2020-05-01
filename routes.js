const router = require('express').Router();
const controller = require('./controller.js');
const multerConfig = require('./utils/multerConfig.js');


/**
 * Render an HTML file on the route connection
 */
router.get('/', controller.chat);

/**
 * The logout route will redirect to login once the destroy session has been done.
 */
router.get('/logout', controller.logout);


router.post('/upload', multerConfig.upload.single('uploadFile'), controller.upload);

module.exports = router;