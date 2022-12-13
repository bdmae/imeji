//selectors

const auth = "563492ad6f91700001000001fb3b59a25dff4d02857393b35f05ffdd";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const submitButton = document.querySelector(".submit-btn");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

//event listeners

searchInput.addEventListener('input', updateInput);

form.addEventListener("submit", e => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

function updateInput(e) {
  searchValue = e.target.value;
}


//function

// https://api.pexels.com/v1/curated?page=1&per_page=15

async function fetchApi(url) {
   const dataFetch = await fetch(
    url,
     {
       method: "GET",
       headers: {
         Accept: "application/json",
         Authorization: auth,
       },
     }
   );
   const data = await dataFetch.json();
   return data;
}

function generatePictures(data){
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
      <div class="gallery-info">
         <h3>${photo.photographer}</h3>
         <a href=${photo.photographer_url}>Website</a>
      </div>
      <div class="img-wrapper">
        <img src=${photo.src.large}></img>
      </div>
    `;
    //then append child to gallery div
    gallery.appendChild(galleryImg);
  });
}


async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?page=1&per_page=40"
  const data = await fetchApi(fetchLink);
  generatePictures(data);
};

// search https://api.pexels.com/v1/search?query=examplepage=1&per_page=15


async function searchPhotos(query) {
 clear();
 fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=20&page=1`;
 const data = await fetchApi(fetchLink);
 generatePictures(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMore() {
  page++;
  //check if theres anything in the search query
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=20&page=${page}`
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?page=${page}&per_page=40`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();

