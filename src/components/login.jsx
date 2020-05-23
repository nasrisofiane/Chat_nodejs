import React, { useState, useEffect } from 'react';

const Login = (props) => {

    const [imageSelected, setImageSelected] = useState(null);
    const [username, setUsername] = useState('');
    const uploadFile = React.createRef();
    const [errorMessage, setErrorMessage] = useState(props.errorMessage);

    useEffect(() => {
    });

    /**
     * Pass input target in the function and retrieve the file selected, read the file data as url and pass it in a event function.
     */
    const handleFileSelect = (e) => {
        let file = e.target.files[0]
        let reader = new FileReader();
        reader.onload = onFileLoaded;
        reader.readAsDataURL(file);
    }

    const handleUsernameChange = (e) =>{
        setUsername(e.target.value);
    }

    const checkLoginAplhanumerics = () =>{
        return /[^A-Z0-9]/ig.test(username);
    }

    /**
     * Take a file in params, retrieve the data url and set the state with the value 
     */
    const onFileLoaded = (e) => {
        setImageSelected(e.target.result);
    }

    /**
     * Return a window with an error message
     */
    const createErrorMessage = () => {
        return (
            <div className="lead rounded-0 alert mt-2 mb-1 p-2 alert-dismissible fade show alert-danger" role="alert">
                <p className="m-0"><strong>{errorMessage}</strong></p>
                <button type="button" className="close p-1" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid h-100 d-flex align-items-sm-stretch align-items-md-center justify-content-center p-0 m-0">
            <div className="col-sm-12 col-md-6 col-xl-4 bg-light p-3 d-flex flex-column justify-content-center align-items-center">

                <div className="container-fluid mb-5 mb-md-0 justify-content-center">
                    <h1 className="text-center display-4">Login</h1>
                </div>

                <form className="container-fluid d-flex flex-column justify-content-center align-items-center" action="/" encType="multipart/form-data" method="post" id="image-form">
                    <input className="rounded-0 col-sm-6 m-1 form-control" name="username" type="text" placeholder="Username" onChange={handleUsernameChange}/>
                    <input type="file" ref={uploadFile} className="d-none form-control-file" name="uploadFile" onChange={handleFileSelect} />
                    <button className="rounded-0 col-sm-6 btn btn-primary m-1" id="send-username-button">Connect</button>
                </form>

                <div className="container-fluid mt-3">
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                        <p className="lead mb-1">Select a picture</p>
                        <img className=" border" src={imageSelected} width="50" height="50" onClick={() => uploadFile.current.click()} id="open-file-dialog" />
                    </div>
                </div>

                <div className="container-fluid h-100 d-flex flex-column align-items-center justify-content-end" id="error-box-login">
                    {errorMessage ? createErrorMessage() : null}

                    <div className="rounded-0 lead mt-2 alert alert-success" role="alert">
                        <h4 className="alert-heading">How to connect ?</h4>
                        <hr></hr>
                        <ul className="list-group rounded-0 bg-none">
                            <li className={`instructions list-group-item rounded-0  ${username.length <= 8 ? 'text-sucess font-weight-normal' : 'text-danger'} `}><div>Username's maximum length is 8</div></li>
                            <li className={`instructions list-group-item rounded-0  ${checkLoginAplhanumerics() ? 'text-danger' : 'text-sucess font-weight-normal'} `}><div>Only aplhanumerics characters</div></li>
                            <li className={`instructions list-group-item rounded-0 ${imageSelected ? 'text-sucess font-weight-normal' : 'text-danger'}`}><div>Choose a picture</div></li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;