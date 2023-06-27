let heroInfo = JSON.parse(localStorage.getItem("heroInfo"));
let favInfo =  new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
// variables from single.html
var title = document.getElementById("title");
var photo = document.getElementById("photo");
var icon = document.getElementById("icon");
var desc = document.getElementById("desc2");
var comics = document.getElementById("comics2");
var series = document.getElementById("series2");
var stories = document.getElementById("stories2");
// Set page title
title.innerHTML =  heroInfo.name;
// Set character image
photo.setAttribute("src", heroInfo.img);
// Set heart icon
icon.setAttribute("class",favInfo.has(`${heroInfo.id}`) ? "heart-icon fa-solid fa-heart" : "heart-icon fa-regular fa-heart");
// Set description
if(heroInfo.desc) {
    desc.innerHTML = heroInfo.desc;
} else {
    desc.innerHTML = "No Description Available"
}
// Set comics
if(heroInfo.comics) {
    comics.innerHTML = heroInfo.comics;
} else {
    comics.innerHTML = "0";
}
// Set series 
if(heroInfo.series) {
    series.innerHTML = heroInfo.series;
} else {
    series.innerHTML = "0";
}
// Set stories
if(heroInfo.stories) {
    stories.innerHTML = heroInfo.stories;
} else {
    stories.innerHTML = "0";
}
// If heart icon is clicked
document.addEventListener('click', e => {
    let target = e.target;

// If user clicks on heart, add/remove to favorites
    if(target.classList.contains("heart-icon")) {
        addToFavorites(target);
    }
});

// Funciton to toggle favorites
function addToFavorites(c) {
// If hero is not added to favorites, add to favorites
    if(c.getAttribute('class')=='heart-icon fa-regular fa-heart') { 
        let favouritesArray = localStorage.getItem("favouriteCharacters");
        if (favouritesArray == null) {
            favouritesArray = [];
        } else {
            favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
        }

        let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
        if (favouritesCharacterIDs == null) {
            favouritesCharacterIDs = new Map();
        } else {
            favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
        }

        favouritesCharacterIDs.set(heroInfo.id, true);   
        favouritesArray.push(heroInfo);
        localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
        localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));

        c.setAttribute('class', 'heart-icon fa-solid fa-heart');
    }   
// If hero is already in favoritets, remove from favorites
    else {
        let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
        let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
        let newFavouritesArray = [];
        favouritesCharacterIDs.delete(`${heroInfo.id}`);
        favouritesArray.forEach((favourite) => {
            if(heroInfo.id != favourite.id){
                newFavouritesArray.push(favourite);
            }
        });

        localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
        localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          
        c.setAttribute('class', 'heart-icon fa-regular fa-heart');
    }
}