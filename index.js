const resultsContainer = document.getElementById('results'); // element to display results within
const inputString = document.getElementById('searchBar');

// take from local storage
var characters = JSON.parse(localStorage.getItem("characters"));
let typingTimer;          

var flag = 0;
//enter key submit function
inputString.addEventListener("keypress", function (event) {

    clearPrevious(resultsContainer);
    if (event.key === "Enter") {
        // Cancel the default action
        event.preventDefault();
        onKeyUpTrigger();
    }
});
// search bar keyup dynamic search
inputString.addEventListener('keyup', async (event) => {
    clearPrevious(resultsContainer);
    clearTimeout(typingTimer);

    if (inputString.value.length >= 2 && event.key != "Enter") {
        typingTimer = setTimeout(onKeyUpTrigger, 800);
    }
});
//custom fav alert function
function popUpAlert() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
//custom unfav alert function
function popUpAlertUnFav() {
    var x = document.getElementById("noSnackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
// When user finishes typing
function onKeyUpTrigger() {
    // data from api
    fetchApiData(inputString.value);
}

// Clear previous search
function clearPrevious(parent) {

    document.querySelectorAll('.list-group-item').forEach(
        child => child.remove());
}

var PUBLIC_KEY = "7abe8aad985cf0d796a764a07071bed0";
var PRIVATE_KEY = "aaf1cfbb5d47f60d57c4cbac6f39eb79aa4f0ea5";

//fetch marvel api data
async function fetchApiData(inputString) {

    var ts = new Date().getTime();
    var hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

    try {
        const response = await fetch(`https://gateway.marvel.com/v1/public/characters?ts=${ts}&nameStartsWith=${inputString}&limit=100&apikey=${PUBLIC_KEY}&hash=${hash}`)
            .then(response => response.json())
            .then(
                function (data) {

                    if (data) {

                        character = data;
                        //view the search
                        fetchCharacters(data);
                    }
                    else
                        nothing();
                }
            );
    } catch (err) {
        console.log('Error:', err);
    }
};

// result not retrieved
function nothing() {
    let ul = document.createElement("ul");
    ul.className = "list-group";

    let aTag = document.createElement('a');
    aTag.className = "list-group-item list-group-item-action small";
    aTag.href = "javascipt:void(0)";

    let span = document.createElement('span');
    span.innerHTML = "No match found!";

    ul.append(aTag);
    aTag.append(span);
    resultsContainer.append(ul)
}

//showing search
function fetchCharacters(Data) {

    let maxResultsToDisplay = 1;
    Data.data.results.map(superHero => {
        if (maxResultsToDisplay > 100) {
            return;
        }
        maxResultsToDisplay++;

        // HTML elements
        let ul = document.createElement("ul");
        ul.className = "list-group";

        let li = document.createElement("li");
        li.className = "list-group-item";

        let aTag = document.createElement('a');
        aTag.className = "list-group-item list-group-item-action small";
        aTag.title = superHero.name;
        aTag.href = "SuperheroPage.html?id=" + superHero.id;

        //Main div
        let primaryDiv = document.createElement('div');
        primaryDiv.className = "d-flex";
        // character image 
        let imageDiv = document.createElement('div');

        let charThumbnail = document.createElement('img');
        charThumbnail.className = "img-fluid";
        charThumbnail.src = superHero.thumbnail.path + ".jpg";

        charThumbnail.alt = superHero.name + "'s thumbnail";
        charThumbnail.height = 120;
        charThumbnail.width = 200;

        //bio of character
        let detailsDiv = document.createElement('div');
        detailsDiv.className = "ml-3";

        let id = document.createElement('div');
        id.innerHTML = superHero.id;


        let characterName = document.createElement('div');
        characterName.innerHTML = superHero.name;
        characterName.className = "font-weight-bold";


        let fav = document.createElement('div');
        let favATag = document.createElement('a');
        favATag.dataset.id = superHero.id;
        favATag.title = "Favourite";
        favATag.href = "javascript:void(0);";
        favATag.id = "fav-btn";
        if (firstLoadFavourite(favATag)) {
            favATag.className = "text-danger ml-auto mt-2 fa-heart fa-lg fas";
        } else {
            favATag.className = "text-danger ml-auto mt-2 far fa-heart fa-lg";
        }

        let description = document.createElement('div');
        description.innerHTML = superHero.description;

        ul.append(aTag);

        aTag.append(primaryDiv);
        primaryDiv.append(imageDiv, detailsDiv, favATag);
        imageDiv.append(charThumbnail);
        detailsDiv.append(characterName, id);

        resultsContainer.append(ul); // appends all superheroes cards to the result div


        favATag.addEventListener('click', function (e) {
            favourite(this);
        });
    });
}


// favourite status first load
function firstLoadFavourite(anchor) {
    if (characters == null) {
        return false;
    } else if (characters.length > 0) {
        if (isFavourite(anchor.dataset.id, characters)) {
            return true;
        }
    }
}

// Toggle fav
function favourite(anchor) {

    // check browser for Storage support
    if (typeof (Storage) == "undefined") {
        window.alert("Storage not supported");
        return;
    }

    characters = JSON.parse(localStorage.getItem("characters"));
    let favIcon = anchor.classList;

    // Handle First favourite character case
    if (characters == null || characters.length == 0) {
        var characters = [];
        for (var key in character.data.results) {
            if (character.data.results[key].id == anchor.dataset.id) {
                characters.push(character.data.results[key]);
            }
        }

        // add to local storage
        localStorage.setItem("characters", JSON.stringify(characters));
        // change icon
        favIcon.remove("far");
        favIcon.add("fas");
        popUpAlert();
    } else { 
        // check if current character is already favourited
        if (isFavourite(anchor.dataset.id, characters)) {
            // remove from favourites
            if (confirm("Remove from favourites?")) {
                let isRemoved = removeFromFavourite(anchor.dataset.id, characters);
                if (isRemoved) {
                    localStorage.setItem("characters", JSON.stringify(characters));
                    // change icon
                    favIcon.remove("fas");
                    favIcon.add("far");
                    //window.alert("Removed from favourites");
                    popUpAlertUnFav();
                } else {
                    window.alert("OOPS! Error!");
                }
            }

        } else { 
            try {
                for (var key in character.data.results) {
                    if (character.data.results[key].id == anchor.dataset.id) {
                        characters.push(character.data.results[key]);
                    }
                }

                // add to local storage
                localStorage.setItem("characters", JSON.stringify(characters));
                // change icon
                favIcon.remove("far");
                favIcon.add("fas");
                // alert message
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
            characters.splice(i, 1);
            return true;
        }
    }
    return false;
}