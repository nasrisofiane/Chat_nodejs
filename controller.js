const usersImagesPath = require('./utils/multerConfig.js').usersImagesPath;
let database = null;

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
 * Check sent image and username if that correspond to the rules and redirect to the depending view.
 */
const login = (req, res) =>{

    //Allow only alphanumeric character and delete all other characters.
    userName =  req.body.username.replace(/[^A-Z0-9]/ig, "");

    if(userName.length && !req.session.username){

        //Settings for the database query
        let querySettings = {
            limit : 0,
            searchByFields : {
                 username : userName
                }
        }

        //Get all sessions with query settings passed as parameters
        database.actionToDatabase(database.getFewDocuments, 'sessions', querySettings , (results) => {
            
            //variable that is equal to true if a session has been found
            let usernameAlreadyExists = results.length ? true : false;
            
            if(usernameAlreadyExists){
                res.redirect('/logout'); 
            }
            else{
                //Attach the username to his current session
                req.session.username = userName;
                    
                //Attach the correct path to the user's image
                req.session.image = `${usersImagesPath}/${req.file.filename}`;
                req.session.save();
                res.redirect('/');
            }
        });

    }
    else{
        res.redirect('/logout');
    }
}

module.exports = {
    chat : chat,
    login : login,
    logout : logout,
    database : (db) => database = db
}