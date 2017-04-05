function deleteAdvertisiment(advertisiment) {
    $.ajax({
        method: "DELETE",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/prodavachnik/" + advertisiment._id,
        headers: getKinveyUserAuthHeaders(),
        success: deleteAdSuccess,
        error: handleAjaxError
    });
    function deleteAdSuccess(response) {
        listAdvertisement();
        showInfo('Book deleted.');
    }
}
function loadAdvertisimentForEdit(advertisiment) {
    $.ajax({
        method: "GET",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/prodavachnik/" + advertisiment._id,
        headers: getKinveyUserAuthHeaders(),
        success: loadBookForEditSuccess,
        error: handleAjaxError
    });
    function loadBookForEditSuccess(ad) {
        $('#formEditBook input[name=id]').val(ad._id);
        $('#formEditBook input[name=title]').val(ad.title);
        $('#formEditBook textarea[name=descr]')
            .val(ad.description);
        $('#formEditBook input[name=date-published]').val(ad.dateOfPublisher);
        $('#formEditBook input[name=price]').val(ad.Price);
        $('#formEditBook input[name=imag]').val(ad.image);
        showView('viewEditeAd');
    }
}
function editAd() {
    $('#advertisiment').empty()
    let data={
        title:$('#formEditBook input[name=title]').val(),
        description:$('#formEditBook textarea[name=descr]').val(),
        publisher:sessionStorage.getItem('name'),
        dateOfPublisher:$('#formEditBook input[name=date-published]').val(),
        Price:$('#formEditBook input[name=price]').val(),
        image:$('#formEditBook input[name=imag]').val()
    }
    $.ajax({
        method: "PUT",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/prodavachnik/" + $('#formEditBook input[name=id]').val(),
        data:data,
        headers: getKinveyUserAuthHeaders(),
        success: editAdSuccess,
        error: handleAjaxError
    });
    function editAdSuccess(response) {
        listAdvertisement();
        showInfo('Book edited.');
    }
}




function loginUser() {
    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=passwd]').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/"+"login",
        headers: kinveyAppAuthHeaders,
        data:userData,
        success: loginSuccess,
        error: handleAjaxError
    });
    function loginSuccess(userInfo) {
        $('#viewLogin').hide()
        saveAuthInSession(userInfo)
        showHideMenuLinks();
        listAdvertisement()
        showInfo('Login successful.');
    }
}

function logout() {
    sessionStorage.clear()
    $('#loggedInUser').text('')
    showView('viewHome');
    showHideMenuLinks()
    showInfo('Logout successful.')

}