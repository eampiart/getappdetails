$(document).ready(function () {
    clearResults(); // make sure that there is nothing in the results div

    //when the input changes (ex. on enter), initiate a search for the given term
    $('#searchBox').focus().on('change', function () {
        term = $('#searchBox').val()
        if (term.length > 0) {
            searchForTerm(term);
        } else {
            clearResults();
            $('#hint').hide()
        }
    });
});

/* ------------ Store Search function and related functions*/

function searchForTerm (term) {
    var itunesBaseURL = 'https://itunes.apple.com/search?callback=?'; //callback needed for CORS
    var searchParams = {country : 'ch', limit : 1, media : 'software', term : term }; // code can adapt for a higher search result limit

    // make an AJAX call to get the JSON containing the search results
    $.getJSON(itunesBaseURL, searchParams, function (response) {
        var searchResults = response.results;
        handleSearchResults(searchResults);
    });
}

// Helper function to handle the results from the function searchForTerm
function handleSearchResults (searchResults) {
    $('#hint').show().css("display", "block"); //show hint under the search box
    clearResults(); // make sure that there are no results from previous searches

    var resultsHTML = '';
    $.each(searchResults, function() {
        resultsHTML += '<img class="appIcon" src="' + this.artworkUrl100 + '">';
        resultsHTML += '<div id="appDetails"><a class="appName" href="' + this.trackViewUrl + '">';
        resultsHTML += '<span class="appName">' + this.trackName + '</span></a>';
        resultsHTML += '<a href="' + this.trackViewUrl + '">';
        resultsHTML += '<span class="appPrice">' + this.formattedPrice + '</span></a></div>';
    });
    $('#results').append(resultsHTML); // show search results
    $('span.appName').closest('a').css('text-decoration','none'); //remove link styling

    /* ------------ Create JSON string for first result ONLY */
    var app = searchResults[0];
    var appJSONObject = "{\"trackName\" : \"" + app.trackName + "\",\"trackId\" : " + app.trackId + ",\"trackViewUrl\" : \"" + app.trackViewUrl + "\",\"artworkUrl60\" : \"" + app.artworkUrl60 + "\",\"artworkUrl100\" : \"" + app.artworkUrl100 + "\",\"artworkUrl512\" : \"" + app.artworkUrl512 + "\",\"formattedPrice\" : \"" + app.formattedPrice + "\",\"description\" : \"<--FILL IN -->\"}";
    // add JSON string to DOM and reveal the corresponding div
    $('#jsonView').append("<p>"+appJSONObject + "</p>");
    $('#jsonView').show()
}

function clearResults () {
    $('#results').html('');
    $('#jsonView').html('').hide();
}
