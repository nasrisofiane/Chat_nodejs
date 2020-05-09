import React, { useState, useEffect } from 'react';

const UsersList = (props) => {

    /**
     * Generate a div with the user's informations in the list of users
     */
    const userDivInList = (userInformations, index) => {
        return (
            <div key={index} className="users-square col-lg-1 text-center align-items-center justify-content-center p-0">
                <section className="container-fluid p-0">
                    <p className="mb-1 lead text-center">{userInformations.username}</p>

                    <div className="row mb-2 align-items-center justify-content-center">
                        <img className="col-10" src={userInformations.image} />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="row-fluid d-flex flex-row flex-nowrap bg-primary m-0" id="users-list">
            {props.users.map((user, index) => userDivInList(user, index))}
        </div>
    );
}

export default UsersList;