var React = require('react');

function HelloMessage(props) {
  return (
    <div class="row h-100 align-items-center justify-content-center">
        <div class="col-sm-6 bg-light p-3">
            <div class="row justify-content-center">
                <h1 class="text-center display-4">Login</h1>
            </div>
                

            <div class="row mt-3">
                <div class="col-12 d-flex flex-column justify-content-center align-items-center">
                    <p class="lead mb-1">Select a picture</p>
                    <img class=" border" src="https://www.pngitem.com/pimgs/m/52-526033_unknown-person-icon-png-transparent-png.png" width="50" height="50" id="open-file-dialog" />
                </div>
            </div>
        </div>
    </div>
  );
}

module.exports = HelloMessage;