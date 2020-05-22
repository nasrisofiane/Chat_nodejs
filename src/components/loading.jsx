import React from 'react';

const Loading = () => {

    return (
        <div className="container-fluid position-absolute d-flex justify-content-center align-items-center bg-secondary h-100" id="loading-container">
            <div className="spinner-border text-primary" id="loading-module" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Loading;