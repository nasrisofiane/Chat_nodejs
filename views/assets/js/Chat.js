class ChatApplication{
    constructor(){
        this.socket = io.connect('http://localhost:8080/');
        this.socket.on('alreadyConnected', message => this.alreadyConnected(message));

        this.initializeChatEvents();

        //Event that redirect to a page if the server trigger the event "redirectTo"
        this.socket.on('redirectTo', redirectTo => window.location.pathname = redirectTo);
    }

    /**
     * Initialize events for the chat page
     */
    initializeChatEvents = () =>{
        let buttonSendMessage = document.getElementById('send-message-button');
        let buttonDisconnect = document.getElementById('disconnect-button');
        let messageInput = document.getElementById('text-message');

        buttonSendMessage.addEventListener('click', () => this.sendMessage());
        buttonDisconnect.addEventListener('click', () => this.socket.emit('logout'));

        this.socket.emit('chatJoined');

        //Event that retrieve the last messages once the server triggered the event.
        this.socket.on('lastMessages', messages => this.addMessageToChatArea(messages));

        //Event that retrieve new messages once the server triggered the event. 
        this.socket.on('message', message => this.addMessageToChatArea(message));

        this.socket.on('connectedUsers', users => this.createUsersList(users));
        
        //Send message when enter key is pressed
        messageInput.addEventListener("keydown", event => {
                if (event.keyCode === 13) {
                    this.sendMessage();
                    return;
                }
            }
        );

    }

    /**
     * Create a list of connected users
     */
    createUsersList = (users) =>{
        let usersContainer = document.getElementById('users-list');
        
        usersContainer.innerHTML = '';
        users.map(user => usersContainer.innerHTML += `<div class="col-lg-1 border text-center align-items-center justify-content-center p-0">
            <section class="container-fluid p-0">    
                <p class="mb-1 lead text-center">${user.username}</p> 
                <div class="row">
                    <img class="col-12" src="${user.image}"/>
                </div> 
            </section>
        </div>`);

        console.log(users);
    }

    /**
     * Display an error message if the user is already connected
     */
    alreadyConnected = (message) =>{
        let body = document.body;
        body.innerHTML = `<div class="row h-100 align-items-center justify-content-center display-4">${message}</div>`;
    }
     
    /**
     * Function that add text to chat area.
     */
    addMessageToChatArea = message =>{
        let chatArea = document.getElementById('chat-area');
        let userNameContainer = document.getElementById('username-container');

        if(message.messages){
            //Appends lasts messages to the page.
            message.messages.map(message => chatArea.innerHTML += `<p><strong>${message.userName}</strong> : ${message.message}</p>`);
        }
        else{

            //Appends a message to the chat area
            switch(message.messageType){
                case 'me':
                    userNameContainer.innerHTML = `<p class="m-0 p-0"><em>${message.message} ${message.userName}</em></p>`
                    break;
                
                case 'notme':

                    chatArea.innerHTML += `
                        <div class="alert alert-dismissible fade show alert-info" role="alert">
                            <p><em><strong>${message.userName}</strong> ${message.message}</em></p>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                    break;

                case 'message':
                    chatArea.innerHTML += `<p><strong>${message.userName}</strong> : ${message.message}</p>`
                    break;
    
                case 'disconnected':
                    chatArea.innerHTML += `
                        <div class="alert alert-dismissible fade show alert-warning" role="alert">
                            <p><em><strong>${message.userName}</strong> ${message.message}</em></p>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                    break;
            }
        }
    }
    
    /**
     * Send value from the text input to the server event "message"
     */
    sendMessage = () =>{
        let  messageInput = document.getElementById('text-message');
        this.socket.emit('message', messageInput.value);

        //Clean the value once the message has been sent to the server.
        messageInput.value = "";
    }

}

new ChatApplication();