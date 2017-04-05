function startProdavachnik() {
  //  sessionStorage.clear()

    showHideMenuLinks()
    showView('viewHome')

    $("#linkHome").click(showHomeView);
    $('#linkLogin').click(showLoginView)
    $('#linkRegister').click(showRegister)
    $('#linkListAdvertisement').click(listAdvertisement)
    $('#linkCreateAdvertisement').click(createAdvertisiment)

    $('#buttonRegisterUser').click(registerUser)
    $('#linkLogout').click(logout)
    $('#buttonLoginUser').click(loginUser)
    $('#buttonCreateAdd').click(createAd)
    $('#buttonEditAdd').click(editAd)


    $("form").submit(function(e) { e.preventDefault() });

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_BJ-HFMsFl";
    const kinveyAppSecret =
        "0e4134c8b58f49feb12a44d31a4b1dfa";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };
    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });

    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    function createAd() {
        let data={
            title:$('#formCreateAd input[name=title]').val(),
            description:$('#formCreateAd textarea[name=descr]').val(),
            publisher:sessionStorage.getItem('name'),
            dateOfPublisher:$('#formCreateAd input[name=date-published]').val(),
            Price:$('#formCreateAd input[name=price]').val(),
            image:$('#formCreateAd input[name=image]').val()

        }
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/prodavachnik",
            headers: getKinveyUserAuthHeaders(),
            data: data,
            success: createAdSuccess,
            error: handleAjaxError
        });
        function createAdSuccess() {
            listAdvertisement()
            showInfo('Advertisiment created')
        }
    }

    function createAdvertisiment() {
        $('#formCreateAd').trigger('reset')
        showView('viewCreateAd')
    }

    function listAdvertisement() {
        $('#advertisiment').empty()
        showView('viewAdvertisement')
        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/prodavachnik",
            headers: getKinveyUserAuthHeaders(),
            success: loadAdvertisitemSuccess,
            error: handleAjaxError
        })
        function loadAdvertisitemSuccess(infoAdvertisiment) {
            showInfo('Advertisiment loaded.');
            if (infoAdvertisiment.length == 0) {
                $('#books').text('No Advertisimen in the library.');
            } else {

                let advertisimentTable = $('<table>')
                    .append($('<tr>').append(
                        '<th>Title</th><th>Description</th>',
                        '<th>Publisher</th><th>Date Published</th>',
                        '<th>Price</th><th>Action</th>'
                    ));
                for (let advertisiment of infoAdvertisiment){
                    appendAdvertisimentRow(advertisiment, advertisimentTable)
                }
                $('#advertisiment').append(advertisimentTable);
            }
        }
    }
    function appendAdvertisimentRow(advertisiment, advertisimentTable) {

        let moreInfo= $('<a href="#">[Read More]</a>')
            .click(displayAdvert.bind(this, advertisiment));
        let links=[moreInfo]
        if (advertisiment._acl.creator == sessionStorage['userId']) {
            let deleteLink = $('<a href="#">[Delete]</a>')
                .click(deleteAdvertisiment.bind(this, advertisiment));
            let editLink = $('<a href="#">[Edit]</a>')
                .click(loadAdvertisimentForEdit.bind(this, advertisiment));
            links.push(deleteLink);
            links.push(' ')
            links.push(editLink)
        }


        advertisimentTable.append($('<tr>').append(
            $('<td>').text(advertisiment.title),
            $('<td>').text(advertisiment.description),
            $('<td>').text(advertisiment.publisher),
            $('<td>').text(advertisiment.dateOfPublisher),
            $('<td>').text(advertisiment.Price),

            $('<td>').append(links)
        ));
    }
    function moreInfo(id) {
        alert(id)
    }

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




}