import React, { useState, useEffect } from 'react';

const Login = (props) => {

    const [imageSelected, setImageSelected] = useState(null);
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
    
    /**
     * Take a file in params, retrieve the data url and set the state with the value 
     */
    const onFileLoaded = (e) => {
        setImageSelected(e.target.result);
    }

    /**
     * Return a window with an error message
     */
    const createErrorMessage = () =>{
        return (
            <div className="alert mt-2 mb-1 p-2 alert-dismissible fade show alert-danger" role="alert">
                <p className="m-0"><strong>{errorMessage}</strong></p>
                <button type="button" className="close p-1" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }

    return(
        <div className="row h-100 align-items-center justify-content-center">
            <div className="col-sm-6 bg-light p-3">
                
                <div className="row justify-content-center">
                    <h1 className="text-center display-4">Login</h1>
                </div>
                
                <form className="row justify-content-center" action="/" encType="multipart/form-data" method="post" id="image-form">
                    <input className="rounded-0 col-sm-6 m-1 form-control" name="username" type="text" placeholder="Username"/>
                    <input type="file" ref={uploadFile} className="d-none form-control-file" name="uploadFile" onChange={handleFileSelect} />
                    <button className="rounded-0 col-sm-6 btn btn-primary m-1" id="send-username-button">Connect</button>
                </form>

                <div className="row mt-3">
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                        <p className="lead mb-1">Select a picture</p>
                        <img className=" border" src={imageSelected} width="50" height="50" onClick={ () => uploadFile.current.click()} id="open-file-dialog" />
                    </div>
                </div>
                {errorMessage ? createErrorMessage() : null}
            </div>
        </div>
  );
}

export default Login;