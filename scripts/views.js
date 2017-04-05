function getKinveyUserAuthHeaders() {
    let user=sessionStorage.getItem('authToken')
    return {
        'Authorization':'Kinvey '+user}
}

function registerUser() {
    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=passwd]').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
        headers: kinveyAppAuthHeaders,
        data:userData,
        success: registerSuccess,
        error: handleAjaxError
    });
    function registerSuccess(userInfo) {
        $('#viewRegister').hide()
        saveAuthInSession(userInfo)
        showHideMenuLinks();
        showInfo('User registration successful.');
    }

}

function showInfo(message) {
    $('#infoBox').text(message);
    $('#infoBox').show();
    setTimeout(function() {
        $('#infoBox').fadeOut();
    }, 3000);
}
function saveAuthInSession(userInfo) {
    let autUser=userInfo._kmd.authtoken
    sessionStorage.setItem('authToken',autUser)
    let userId=userInfo._id
    sessionStorage.setItem('userId',userId)
    let username = userInfo.username;
    sessionStorage.setItem('name',username)
    $('#loggedInUser').text(
        "Welcome, " + username + "!");
    $('#loggedInUser').show()
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON &&
        response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}
function showError(errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();
}