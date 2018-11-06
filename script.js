// http://api.smitegame.com/smiteapi.svc/getplayerjson/1004/0abd990b4ca9f86817e087ad684515db/83B082E576584DA8B1DB073DECA9E819/20120927193800/HirezPlayer

// devId:       2904
// authKey:  4DFA520F5D3848D1B561D024E3D9BB15

// DevId: 		(eg, 1004)
// AuthKey: 		(eg, 23DF3C7E9BD14D84BF892AD206B6755C)

// CREATING A SESSION
// The url format for calling a method from the api is http://api.smitegame.com/smiteapi.svc/ + the pattern for the method above, where [ResponseFormat] is replaced by the formatting that you want returned (either XML or JSON).
// To create a session with a JSON response, call the createsession method as follows:
// http://api.smitegame.com/smiteapi.svc/createsessionJson/1004/8f53249be0922c94720834771ad43f0f/20120927183145
// which would return JSON data such as:
// {
// 	"ret_msg": "Approved",
// 	"session_id": "0ECDF26BC1F04EE4BA4AF10EC3604E04",
// 	"timestamp": "2/14/2013 7:50:20 PM"
// }
// The sessionId is contained in an element called “session_id”. This parameter is needed to call the other methods.
// You'll see that we passed in a few other variables besides our devId and authKey. 
// Actually the authKey is not passed directly, but instead embedded and hashed in another parameter (signature).
 
// CREATING A SIGNATURE
// A distinct signature is required for each API method called.
// The signature is created by concatenating several fields and then hashing the result with an MD5 algorithm. The components of this hash are (in order):
// your devId
// the method name being called (eg, “createsession”)
// This will not include the ResponseType, just the name of the method.
// your authKey
// current utc timestamp (formatted yyyyMMddHHmmss)

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

let signature = GetMD5Hash(2904 + "createsession" + "4DFA520F5D3848D1B561D024E3D9BB15" + )

// Sample C# Code to Create a Signature:
// var signature = GetMD5Hash("1004" + "createsession" + "23DF3C7E9BD14D84BF892AD206B6755C" + "20120927183145");
// private static string GetMD5Hash(string input) {
// 	var md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
// 	var bytes = System.Text.Encoding.UTF8.GetBytes(input);
// 	bytes = md5.ComputeHash(bytes);
// 	var sb = new System.Text.StringBuilder();
// 	foreach (byte b in bytes) {
// 		sb.Append(b.ToString("x2").ToLower());
// 	}
// 	return sb.ToString();
// }


// EXAMPLE API CALL
// The uri to use for all API calls starts with http://api.smitegame.com/smiteapi.svc/ followed by
// a slash + the method + any parameters to complete the call.
// For example, to get stats for a given player, call getplayer in the following manner:
// http://api.smitegame.com/smiteapi.svc/getplayerjson/1004/0abd990b4ca9f86817e087ad684515db/83B082E576584DA8B1DB073DECA9E819/20120927193800/HirezPlayer

// Again, the complete pattern for this call is:
// getplayer[ResponseFormat]/{devId}/{signature}/{sessionId}/{timestamp}/{playerName}

'use strict';

const apiKey = '';
const searchURL = '';




function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();
    // iterate through the items array
    for (let i = 0; i < responseJson.data.length; i++) {
        // for each video object in the items 
        //array, add a list item to the results 
        //list with the video title, description,
        //and thumbnail
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
      </li>`
        )
    };
    //display the results section  
    $('#results').removeClass('hidden');
};

function getYouTubeVideos(query, maxResults = 10) {
    const params = {
        key: apiKey,
        q: query,
        limit: maxResults,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getYouTubeVideos(searchTerm, maxResults);
    });
}

$(watchForm);