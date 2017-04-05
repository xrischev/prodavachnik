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