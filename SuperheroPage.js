//custom fav alert function
function popUpAlert() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
//custom unfav alert function
function popUpAlertUnFav() {
    var x = document.getElementById("noSnackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
//fetch params
function fetchParameters(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

// Get params from  URL
const characterId = fetchParameters(window.location.href).id;
var character;

// retrieve data from local storage
var characters = JSON.parse(localStorage.getItem("characters"));

// fetch superhero details
fetchAPIResponse(characterId);

// Hit API and Fetch the matching characters
async function fetchAPIResponse(id) {
    var PRIVATE_KEY = "a41400171c68d9748448c77757001cc2b078d368";
    var PUBLIC_KEY = "0c1a1a57ec246de931291d3bff822ca7";
    var ts = new Date().getTime();
    var hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

    try {
        const response = await fetch(`https://gateway.marvel.com/v1/public/characters?ts=${ts}&id=${id}&limit=6&apikey=${PUBLIC_KEY}&hash=${hash}`)
            .then(response => response.json()) // converting response to json
            .then(
                function (data) {
                    if (data) {
                        character = data;
                        fetchCharacters(data);
                    } else
                        nothing();
                }
            );
    } catch (err) {
        console.log('Error : ', err);
    }
}

function nothing() {
    document.body.innerHTML = "OOPS! Something went wrong."
    setTimeout(window.location.replace("index.html"), 100000);
}

// fetch Results
function fetchCharacters(Data) {

    document.getElementsByClassName('card-title')[0].innerHTML = Data.data.results[0].name;

    heroAvatar = document.getElementsByClassName('card-img')[0];
    heroAvatar.src = Data.data.results[0].thumbnail.path + ".jpg";
    heroAvatar.alt = Data.data.results[0].name + "'s thumbnail";

    document.getElementById('ID').innerHTML = Data.data.results[0].id;
    document.getElementById('Description').innerHTML = Data.data.results[0].description;
    document.getElementById('modified').innerHTML = Data.data.results[0].modified;

    for (var key in Data.data.results[0].comics.items) {
        document.getElementById('comics').innerHTML += Data.data.results[0].comics.items[key].name + ", ";

    }

    for (var key in Data.data.results[0].events.items) {
        document.getElementById('events').innerHTML += Data.data.results[0].events.items[key].name + ", ";

    }

    for (var key in Data.data.results[0].series.items) {
        document.getElementById('series').innerHTML += Data.data.results[0].series.items[key].name + ", ";

    }

    for (var key in Data.data.results[0].stories.items) {
        document.getElementById('stories').innerHTML += Data.data.results[0].stories.items[key].name + ", ";

    }

    for (var key in Data.data.results[0].urls) {
        document.getElementById('more-info').innerHTML += Data.data.results[0].urls[key].url + ", ";

    }
    firstLoadFavourite();
}

// favourite status first load
function firstLoadFavourite() {
    if (characters == null) {
        return false;
    } else if (characters.length > 0) {
        let favIcon = document.getElementById('fav-btn').firstChild.classList;
        if (isFavourite(character.data.results[0].id, characters)) {
            favIcon.remove('far');
            favIcon.add('fas');

        }
    }
}

// Toggle favourite
function favourite(anchor) {
    // check browser support
    if (typeof (Storage) == "undefined") {
        window.alert("Sorry! No Web Storage support..");
        return;
    }

    characters = JSON.parse(localStorage.getItem("characters"));
    let favIcon = anchor.firstChild.classList;

    // First favourite character case
    if (characters == null || characters.length == 0) {
        var characters = [];
        characters.push(character.data.results[0]);
        // add to local storage
        localStorage.setItem("characters", JSON.stringify(characters));
        // change icon
        favIcon.remove("far");
        favIcon.add("fas");
        popUpAlert();
    } else {  
        // check if current character is already favourite
        if (isFavourite(character.data.results[0].id, characters)) {
            // remove from favourites
            if (confirm("Remove " + character.data.results[0].name + " from favourites?")) {
                let isRemoved = removeFromFavourite(character.data.results[0].id, characters);
                if (isRemoved) {
                    localStorage.setItem("characters", JSON.stringify(characters));
                    // change icon
                    favIcon.remove("fas");
                    favIcon.add("far");
                    popUpAlertUnFav();
                } else {
                    window.alert("OOPS! Something went wrong!");
                }
            }

        } else {
            try {
                characters.push(character.data.results[0]);
                // add to local storage
                localStorage.setItem("characters", JSON.stringify(characters));
                // change icon
                favIcon.remove("far");
                favIcon.add("fas");
                popUpAlert();
            } catch (error) {
                window.alert("OOPS! Something went wrong!");
            }

        }
    }
}

// Check if character is already favourite
function isFavourite(characterId, characters) {
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].id == characterId) {
            return true;
        }
    }
    return false;
}

// Remove character from the favourites
function removeFromFavourite(characterId, characters) {

    for (let i = 0; i < characters.length; i++) {
        if (characters[i].id == characterId) {
            console.log("SPLICING");
            characters.splice(i, 1);
            return true;
        }
    }
    return false;
}
