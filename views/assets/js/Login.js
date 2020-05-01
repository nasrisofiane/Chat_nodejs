class Login{
    constructor(){
        this.socket = io.connect('http://localhost:8080/');
        this.socket.on('alreadyConnected', message => this.alreadyConnected(message));

        this.initializeLoginEvents();
    }

    //submit the file from the form
    addFileToServer = () => {
        document.forms["image-form"].submit();
    }

    /**
     * Send all informations to connect to the chat area.
     */
    connectToChat = () => {
        let userName = document.getElementById('username-input').value;

        //Trigger the "newUser" event on server side by sending the username.
        this.socket.emit('newUser', userName);
        this.addFileToServer();
    }

    /**
     * Initialize events for the login page
     */
    initializeLoginEvents = () =>{
        let buttonSendUsername = document.getElementById('send-username-button');
        let openFileDialogButton = document.getElementById('open-file-dialog');
        let fileInput = document.getElementById('image-dialog');
        
        fileInput.addEventListener('change', (e) => {this.handleFileSelect(e)});
        openFileDialogButton.addEventListener('click', () => fileInput.click());
        buttonSendUsername.addEventListener('click', () => this.connectToChat());
    }
    
    handleFileSelect = (e) => {
        let files = e.target.files;
        let  file = files[0];
        let reader = new FileReader();
        reader.onload = this.onFileLoaded;
        reader.readAsDataURL(file);
    }
    
    onFileLoaded = (e) => {
        let  match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
        let mimeType = match[1];
        let content = match[2];
        document.getElementById('open-file-dialog').src = `data:${mimeType};base64, ${content}`;
    }

}

new Login();