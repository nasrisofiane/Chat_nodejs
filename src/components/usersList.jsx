import React, { useState, useEffect } from 'react';

const UsersList = (props) => {

    const [openModalButton, setOpenModalButton] = useState(React.createRef());

    /**
     * Generate a div with the user's informations in the list of users
     */
    const userDivInList = (userInformations, index) => {

        getPendingMessages(userInformations);
        let iconConnectedColor = userInformations.connected ? 'text-success' : 'text-danger';
        let showPendingMessages = userInformations.pendingMessages <= 0 ? 'd-none' : 'd-flex';

        return (
            <div onClick={() => checkMyDivInList(userInformations)} key={index} className="users-square col-lg-1 text-center align-items-center justify-content-center p-0">
                <section className="container-fluid p-0">
                    <p className="mb-1 lead text-center">{userInformations.username}</p>

                    <div className="row mb-2 align-items-center justify-content-center">
                        <img className="col-10" src={userInformations.image} />
                        <div className={`position-absolute col-12 m-0  p-0 user-status-connected align-self-end d-flex justify-content-end`}>
                            <div className="rounded-pill p-1 bg-dark d-flex justify-content-center">
                                <p className={`p-1 m-0 ${showPendingMessages} justify-content-center text-success align-items-center`}>{userInformations.pendingMessages}</p>
                                <i className={`fas fa-plug ${iconConnectedColor}`}></i>
                            </div>
                        </div>
                    </div>
                </section>

                {props.myInformations.username == userInformations.username ? createModal() : null}
            </div>

        );
    }

    const getPendingMessages = (userInformations) => {
        if (Array.isArray(props.privateMessages[userInformations.username])) {
            userInformations.pendingMessages = props.privateMessages[userInformations.username].filter(message => message.seen == false).length;
        }
        else {
            userInformations.pendingMessages = 0;
        }
    }

    /**
     * Function that return a JSX bootstrap Modal with an error message in it.
     */
    const createModal = () => {
        return (
            <div>
                <button ref={openModalButton} type="button" className="d-none btn btn-primary" data-toggle="modal" data-target="#errorModal">Open modal</button>

                <div className="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="errorModalUsersList" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="rounded-0 modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-center" id="exampleModalLongTitle">Error</h5>
                            </div>
                            <div className="text-center modal-body">
                                Cannot select yourself
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="rounded-0 btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Function that avoid the user to open is own private message window.
     * If the user find a way to do it, backend will block the user from sending message to himself.
     * @param {*} userInformations 
     */
    const checkMyDivInList = (userInformations) => {

        if (props.myInformations.username == userInformations.username) {
            openModalButton.current.click();
        }
        else {
            props.getUser(userInformations);
        }
    }


    return (
        <div className="row-fluid d-flex flex-row flex-nowrap bg-primary m-0" id="users-list">
            {props.users.map((user, index) => userDivInList(user, index))}
        </div>
    );
}

export default UsersList;