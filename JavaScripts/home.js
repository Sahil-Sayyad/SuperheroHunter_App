/* Main Javascript */

//Declaring Marvel public and private key 
const PUBLIC_KEY = '6ce57c8d2e003d0fc08b953a4eb859d6';
const PRIVATE_KEY ='cdd02398e973b69a4044918ac8208448f05f676d';

//Generating hash key 
function generateHash(timestamp) {
  const hash = CryptoJS.MD5(`${timestamp}${PRIVATE_KEY}${PUBLIC_KEY}`).toString();
  return hash;
}

//Accessing HTMl Elements 
let searchBar = document.getElementById('searchcharacter');
let searchResults = document.getElementById('searchresults');

searchBar.addEventListener("input", ()=> fetchCharacters(searchBar.value));
//Fetching Marvel API 
async function fetchCharacters(characterName) {

  if(characterName.length > 0){
    const timestamp = new Date().getTime();
    const hash = generateHash(timestamp);
    const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${characterName}&limit=7&ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}`;
    await fetch(apiUrl)
    .then((response) => {return response.json()})
    .then((data) => {
      //Handle the response data
      showData(data);
    })
    .catch((error) => {
      //Handle the Error
      console.error(error);
    });
  }else{
    searchResults.innerHTML = " ";
  }
}

// Displaying Character Data 

function showData(data){
    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
    if(favouritesCharacterIDs == null){
        favouritesCharacterIDs = new Map();
    }else if (favouritesCharacterIDs != null){
         favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
    }

    res = data.data.results;
    let html = ``;
    console.log(res);
    if(res){
        html = res.map(element =>{
            return `
            <div class="card">
            <img id="poster" class="poster" src="${element.thumbnail.path+'/portrait_medium.' + element.thumbnail.extension}">
            <div class="details">
                <p id="cardName" class="cardName"> ${element.name} </p>
                <div style="display:none;">
                    <span>${element.name}</span>
                    <span>${element.description}</span>
                    <span>${element.comics.available}</span>
                    <span>${element.series.available}</span>
                    <span>${element.stories.available}</span>
                    <span>${element.thumbnail.path+'/portrait_uncanny.' + element.thumbnail.extension}</span>
                    <span>${element.id}</span>
                </div>                
                <div class="icon">
                    <i class="${favouritesCharacterIDs.has(`${element.id}`) ? "heart-icon fa-solid fa-heart" 
                    :"heart-icon fa-regular fa-heart"}" ></i>
                </div>
            </div>
            </div>
            `
        }).join('');
        searchResults.innerHTML = html;
    }else{
      searchResults.innerHTML = "<h1>Search Result Not Found </h1>";
    }
}

document.addEventListener('click', e =>{
    let target = e.target;

    if(target.classList.contains("heart-icon")){
       addToFavorites(target);
    }
    if(target.classList.contains("cardName")){
       openSinglePage(target);
       window.open("./single.html", "_blank");
    }

})
// Function which adds and removes the item to favorites list
function addToFavorites(c) {
  let heroInfo = {
      name: c.parentElement.parentElement.children[1].children[0].innerHTML,
      desc: c.parentElement.parentElement.children[1].children[1].innerHTML, 
      comics: c.parentElement.parentElement.children[1].children[2].innerHTML, 
      series: c.parentElement.parentElement.children[1].children[3].innerHTML, 
      stories: c.parentElement.parentElement.children[1].children[4].innerHTML,
      img: c.parentElement.parentElement.children[1].children[5].innerHTML,
      id: c.parentElement.parentElement.children[1].children[6].innerHTML
  }
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

// Function which stores the info object of character for which user want to see the info 
function openSinglePage(c) {
// This function basically stores the data of character in localStorage.
// When user clicks on the name, the info page is opened that fetches the heroInfo and displays the data 

  let heroInfo = {
      name: c.innerHTML, desc: c.parentElement.children[1].children[1].innerHTML, 
      comic: c.parentElement.children[1].children[2].innerHTML, 
      series: c.parentElement.children[1].children[3].innerHTML, 
      stories: c.parentElement.children[1].children[4].innerHTML, 
      img: c.parentElement.children[1].children[5].innerHTML,
      id: c.parentElement.children[1].children[6].innerHTML
  }
// Add to local storage
  localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}