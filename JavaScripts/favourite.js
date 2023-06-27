let heroInfo = JSON.parse(localStorage.getItem("favouriteCharacters"));

// Variables from favorites.html
var result = document.getElementById("result");
var noResult = document.getElementById("empty-fav");

// console.log(heroInfo);

// Function to load favorite heros
window.addEventListener("load", function () {
  let html = ``;
  // Empty heroInfo
  if (heroInfo == null) {
    console.log("null");
    noResult.innerHTML =
      'Favorites is empty, go to &nbsp; <a href="./home.html" style="text-decoration: underline; color: inherit";> HOME </a> &nbsp; and add your favorite heroes';
  }
  // Characters have been removed from favourites
  else if (heroInfo.length == 0) {
    console.log("empty");
    noResult.innerHTML =
      'Favorites is empty, go to &nbsp; <a href="./home.html" style="text-decoration: underline; color: inherit";> HOME </a> &nbsp; and add your favorite heroes';
  }
  // Show the heros added to favorites
  else {
    html = heroInfo
      .map((element) => {
        return `
                <div class="card">
                <img id="poster" class="poster" src="${element.img}">
                <div class="details">
                    <p id="cardName" class="cardName"> ${element.name} </p>
                    <div style="display:none;">
                        <span>${element.name}</span>
                        <span>${element.desc}</span>
                        <span>${element.comics}</span>
                        <span>${element.series}</span>
                        <span>${element.stories}</span>
                        <span>${element.img}</span>
                        <span>${element.id}</span>
                    </div>                
                    <div class="icon">
                        <i class="heart-icon fa-solid fa-heart"></i>
                    </div>
                </div>
                </div>
            `;
      })
      .join("");
    result.innerHTML = html;
  }
});

// Function for attacthing eventListener to buttons
document.addEventListener("click", (e) => {
  let target = e.target;

  // If user clicks on heart, remove from favorites
  if (target.classList.contains("heart-icon")) {
    removeFromFavorites(target);
  }

  // If user clicks on the name, open single page
  if (target.classList.contains("cardName")) {
    openSinglePage(target);
    window.open("./single.html", "_self");
  }
});

// Function to remove characters from favorites
function removeFromFavorites(c) {
  // Storing the Id of character in a voriable
  let idOfCharacterToBeDeleted =
    c.parentElement.parentElement.children[1].children[6].innerHTML;
  // getting the favourites array which stores objects of character
  let favourites = JSON.parse(localStorage.getItem("favouriteCharacters"));
  let favouritesCharacterIDs = new Map(
    JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
  );
  // deleting the characters id from favouritesCharacterId map
  favouritesCharacterIDs.delete(`${idOfCharacterToBeDeleted}`);
  // deleting the character form array whose id is matched
  favourites.forEach(function (favourite, index) {
    if (favourite.id == idOfCharacterToBeDeleted) {
      favourites.splice(index, 1);
    }
  });

  // if all the characters are deleted from favourites and not character left for displaying
  if (favourites.length == 0) {
    noResult.innerHTML =
      'Favorites is empty, go to &nbsp; <a href="./index.html" style="text-decoration: underline; color: inherit";> HOME </a> &nbsp; and add your favorite heroes';
  }

  // Updating the new arrays in localStorage
  localStorage.setItem("favouriteCharacters", JSON.stringify(favourites));
  localStorage.setItem(
    "favouritesCharacterIDs",
    JSON.stringify([...favouritesCharacterIDs])
  );
  c.parentElement.parentElement.parentElement.remove();
}

// Function which stores the info object of character for which user want to see the info
function openSinglePage(c) {
  // This function basically stores the data of character in localStorage.
  // When user clicks on the name, the info page is opened that fetches the heroInfo and displays the data

  let heroInfo = {
    name: c.innerHTML,
    desc: c.parentElement.children[1].children[1].innerHTML,
    comic: c.parentElement.children[1].children[2].innerHTML,
    series: c.parentElement.children[1].children[3].innerHTML,
    stories: c.parentElement.children[1].children[4].innerHTML,
    img: c.parentElement.children[1].children[5].innerHTML,
    id: c.parentElement.children[1].children[6].innerHTML,
  };
  // Add to local storage
  localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
