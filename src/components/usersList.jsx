import React, { useState, useEffect } from 'react';

const UsersList = (props) => {

    const [openModalButton, setOpenModalButton] = useState(React.createRef());

    /**
     * Generate a div with the user's informations in the list of users
     */
    const userDivInList = (userInformations, index) => {
        return (
            <div onClick={() => checkMyDivInList(userInformations)} key={index} className="users-square col-lg-1 text-center align-items-center justify-content-center p-0">
                <section className="container-fluid p-0">
                    <p className="mb-1 lead text-center">{userInformations.username}</p>

                    <div className="row mb-2 align-items-center justify-content-center">
                        <img className="col-10" src={userInformations.image} />
                    </div>
                </section>

                {props.myInformations.username == userInformations.username ? createModal() : null}
            </div>

        );
    }

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

    const checkMyDivInList = (userInformations) => {
        if (props.myInformations.username == userInformations.username) {
            openModalButton.current.click();
        }
        else {
            props.getUser(userInformations)
        }
    }


    return (
        <div className="row-fluid d-flex flex-row flex-nowrap bg-primary m-0" id="users-list">
            {props.users.map((user, index) => userDivInList(user, index))}
        </div>
    );
}

export default UsersList;