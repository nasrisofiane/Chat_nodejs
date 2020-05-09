import express from "express";
import { login, chat, logout} from './controller';
import { upload } from './utils/multerConfig';

const router = express.Router();

/**
 * Render an HTML file on the route connection
 */
router.get('/', chat);

/**
 * Send post parameters to controller function
 */
router.post('/', upload.single('uploadFile'), login);

/**
 * The logout route will redirect to login once the destroy session has been done.
 */
router.get('/logout', logout);

export default router;


