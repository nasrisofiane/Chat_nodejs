const usersImagesPath = require('./utils/multerConfig.js').usersImagesPath;

/**
 * Render a view file
 */
const chat = (req, res) =>{
    if(!req.session.username){
        res.sendFile(`${__dirname}/views/login.html`);
    }
    else{
        res.sendFile(`${__dirname}/views/chat.html`);
    }
}

/**
 * Will redirect to login once the destroy session has been done.
 */
const logout = (req, res) =>{
    req.session.destroy();
    res.redirect('/');
}

/**
 * Upload a file to the server data only if an image is received from the user
 */
const upload = (req, res) => {
    
    if(req.file && (req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg')) {
        res.redirect('/');
        req.session.image = `${usersImagesPath}/${req.file.filename}`;
        req.session.save();
        
    }
    else {
        res.redirect('/logout');
    };
}

module.exports = {
    chat : chat,
    logout : logout,
    upload : upload  
}