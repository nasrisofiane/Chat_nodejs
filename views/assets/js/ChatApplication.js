class ChatApplication{
    constructor(){
        this.socket = io.connect('http://localhost:8080/');
        this.socket.on('alreadyConnected', message => this.alreadyConnected(message));

        if(window.location.pathname === '/login'){
            this.initializeLoginEvents();
        }
        else{
            this.initializeChatEvents();
        }

        //Event that redirect to a page if the server trigger the event "redirectTo"
        this.socket.on('redirectTo', redirectTo => window.location.pathname = redirectTo);
    }

    connectToChat = () =>{
        let userName = document.getElementById('username-input').value;

        //Trigger the "newUser" event on server side by sending the username.
        this.socket.emit('newUser', userName);
    }

    initializeLoginEvents = () =>{
        let buttonSendUsername = document.getElementById('send-username-button');
        buttonSendUsername.addEventListener('click', () => this.connectToChat());
    }

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

    createUsersList = (users) =>{
        let usersContainer = document.getElementById('users-list');
        users.map(user => usersContainer.innerHTML += `<div class="col-1 p-1 border text-center align-items-center justify-content-center">
            <section class="container-fluid p-0">    
                <p class="mb-1">${user}</p> 
                <div class="row">
                    <img class="col-12" src="https://www.pngitem.com/pimgs/m/52-526033_unknown-person-icon-png-transparent-png.png"/>
                </div> 
            </section>
        </div>`);
        console.log(users);
    }

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