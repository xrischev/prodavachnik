function showRegister() {
    showView('viewRegister')
    $('#formRegister').trigger('reset')
}

function showView(viewName) {
// Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();

}

function showLoginView() {
    showView('viewLogin')
    $('#formLogin').trigger('reset')
}

function showHomeView() {
    showView('viewHome');
}


function  showHideMenuLinks() {
    $("#linkHome").show();
    if (sessionStorage.getItem('authToken')) {
        // We have logged in user
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkCreateAdvertisement").show();
        $("#linkListAdvertisement").show();
        $("#linkLogout").show();
    } else {
        // No logged in user
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListAdvertisement").hide();
        $("#linkCreateAdvertisement").hide();
        $("#linkLogout").hide();
    }
}
function displayAdvert(advertId) {
    $('#viewDetailsAd').empty()

    $.ajax({
        method: "GET",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/prodavachnik/" + advertId._id,
        headers: getKinveyUserAuthHeaders(),
        success: loadAdvertSuccess,
        error: handleAjaxError
    });

    function loadAdvertSuccess(ad) {
        $('#formEditBook input[name=id]').val(ad._id);
        $('#formEditBook input[name=title]').val(ad.title);
        $('#formEditBook textarea[name=descr]')
            .val(ad.description);
        $('#formEditBook input[name=date-published]').val(ad.dateOfPublisher);
        $('#formEditBook input[name=price]').val(ad.Price);
        //  showView('viewEditeAd');

        let advertInfo=$('<div>').append(
            $('<img>').attr('src',ad.image),
            $('<br>'),
            $('<label>').text('Title'),
            $('<h1>').text(advertId.title),
            $('<label>').text('Description'),
            $('<h1>').text(advertId.description),
            $('<label>').text('Publisher'),
            $('<h1>').text(advertId.publisher),
            $('<label>').text('Date'),
            $('<h1>').text(advertId.dateOfPublisher)
        )
        $('#viewDetailsAd').append(advertInfo)
        showView('viewDetailsAd')

        console.log(ad.image)
    }








}