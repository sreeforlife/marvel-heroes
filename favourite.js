var characters = JSON.parse(localStorage.getItem("characters"));
// if no favourites in the Storage
if (characters == null || characters.length == 0) {
    document.getElementsByClassName('empty-list')[0].classList.remove('d-none');
} else {
    showFavourites();
}

//custom unfav alert function
function popUpAlertUnFav() {
    var x = document.getElementById("noSnackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
function showFavourites() {
    for (let i = 0; i < characters.length; i++) {
        let character = characters[i];
        addCharacter(character);
    }
}

function addCharacter(character) {
    let card = document.createElement('div');
    card.className = 'col-12 p-0 mr-2 my-2 mr-md-4 col-md-3 card';
    // thumbnail of character
    let characterThumbnail = document.createElement('img');
    characterThumbnail.src = character.thumbnail.path + ".jpg";;
    characterThumbnail.classList.add('card-img-top');
    characterThumbnail.alt = character.name + "\'s portrait";
    characterThumbnail.height = "300";
    characterThumbnail.width = "500";
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body p-2';
    let dFlex = document.createElement('div');
    dFlex.className = "d-flex justify-content-between";
    // card-title main div
    let titleDiv = document.createElement('div');
    // card title
    let cardTitle = document.createElement('h5');
    cardTitle.className = "card-title mb-2";
    cardTitle.innerHTML = character.name;
    // favourite button main div
    let favMainDiv = document.createElement('div');
    // favourite button
    let favBtn = document.createElement('a');
    favBtn.href = "javascript:void(0);";
    favBtn.className = "text-danger z-index-2";
    favBtn.id = "fav-btn";
    favBtn.title = "favourite";
    favBtn.dataset.id = character.id;
    favBtn.addEventListener('click', function (e) {
        removeFromFavourite(this);
    })
    // favourite icon
    let favIcon = document.createElement('i');
    favIcon.className = "fas fa-heart fa-lg";
    let dFlex1 = document.createElement('div');
    dFlex1.className = "d-flex justify-content-between";

    let subtitleContainer = document.createElement('div');

    // subtitle
    let subtitle = document.createElement('p');
    subtitle.className = "sub-title text-muted small m-0";
    subtitle.innerHTML = character.name;

    // publisher main div
    let publisherContainer = document.createElement('div');

    // publisher sub div
    let publisher = document.createElement('p');
    publisher.className = "publisher text-muted small m-0";
    publisher.innerHTML = "©MARVEL";

    // list of appearances
    let ul = document.createElement('ul');
    ul.className = "list-group list-group-horizontal small";

    // list of comics
    let comics = document.createElement('li');
    comics.className = "list-group-item small p-2 flex-fill";
    comics.innerHTML = "Comics" + "</br>" + character.comics.available;

    // list of events
    let events = document.createElement('li');
    events.className = "list-group-item small p-2 flex-fill";
    events.innerHTML = "Events" + "</br>" + character.events.available;

    // list of series
    let series = document.createElement('li');
    series.className = "list-group-item small p-2 flex-fill";
    series.innerHTML = "Series" + "</br>" + character.series.available;

    // list of stories
    let stories = document.createElement('li');
    stories.className = "list-group-item small p-2 flex-fill";
    stories.innerHTML = "Stories" + "</br>" + character.stories.available;

    // appending everything
    card.append(characterThumbnail, cardBody, ul);
    cardBody.append(dFlex, dFlex1);
    dFlex.append(titleDiv, favMainDiv);
    titleDiv.append(cardTitle);
    favMainDiv.append(favBtn);
    favBtn.append(favIcon);
    dFlex1.append(subtitleContainer, publisherContainer);
    subtitleContainer.append(subtitle);
    publisherContainer.append(publisher);
    ul.append(comics, events, series, stories);

    // append in document
    document.getElementsByClassName('row')[0].append(card);
}

// Remove from favourite
function removeFromFavourite(element) {

    // remove from localStorage
    if (confirm("Remove " + element.parentElement.previousSibling.firstChild.innerHTML + " from favourites?")) {
        element.parentElement.parentElement.parentElement.parentElement.remove();
    }
    let characterId = element.dataset.id;
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].id == characterId) {
            characters.splice(i, 1);
            localStorage.setItem("characters", JSON.stringify(characters));
            popUpAlertUnFav();
        }
    }

}