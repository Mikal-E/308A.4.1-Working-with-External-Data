/* Part 2 - Item 3
Create an additional file to handle an alternate approach. Axios
This file creation satisfies this*/


import * as Carousel from "./Carousel.js";
import { API_KEY } from "./keys.js";

// Axios Import Statement Below. Uncommented Provided Statement For Import Use

// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

/* Part 2 - Item 4 - Last Bullet Point
Set a default header with your API key so that you do not have to send it manually with all of your requests. */

axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Part 2 - Item 6 - Create a function "updateProgress" that receives a progressEvent object.

function updateProgress(progressEvent) {

    console.log(progressEvent);

    const progress = progressEvent.loaded / (progressEvent.total || progressEvent.loaded) * 100;
    progressBar.style.width = `${progress}%`;

}

// Part 2 - Item 5 - Add Axios interceptors to log the time between request and response to the console.

axios.interceptors.request.use((config) => {

    console.log("Request started");
    config.metadata = { startTime: new Date() };
    progressBar.style.width = "0%";

// Part 2 - Item 7 - In your request interceptor, set the body element's cursor style to "progress."

    document.body.style.cursor = "progress";

    return config;

    }
);

axios.interceptors.response.use((response) => {

    const duration = new Date() - response.config.metadata.startTime;
    console.log(`Request took ${duration}ms`);

// Part 2 - Itme 7 - In your response interceptor, remove the progress cursor style from the body element.

    document.body.style.cursor = "default";

    return response;

    }
);

// Part 2 - Item 4 - Change all of your fetch() functions to axios.

async function initialLoad() {
 
// Retrieve a list of breeds from the cat API using fetch()

  const response = await axios.get("/breeds");
  const data = response.data;


// Create new <options> for each of these breeds, and append them to breedSelect

    data.forEach(breed => {

      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);

    }
  );

/* Part 2 - Item 2 - Last Bullet Point
add a call to breedSelect function to the end of initialLoad function. */


  breedSelect.dispatchEvent(new Event("change"));

}

initialLoad();

// Part 2 - Item 2

// Create an event handler for breedSelect

breedSelect.addEventListener("change", async (event) => {

  const selectedBreed = event.target.value;

  Carousel.clear();

// Sets/clears infoDump element...

  infoDump.innerHTML = "";

// Part 2 - Item 4 - Change all of your fetch() functions to axios.

    const response = await axios.get(`/images/search?limit=10&breed_ids=${selectedBreed}`, {

// Part 2 -Item 4 - Sub-Bullet Point - Pass this function to the axios onDownloadProgress config option in your event handler.

        onDownloadProgress: updateProgress

        }
    );

    const data = response.data; 
    
// For each object in the response array, create a new element for the carousel

    data.forEach(item => {

      const carouselItem = Carousel.createCarouselItem(

        item.url,
        item.breeds[0].name,
        item.id

      );

// Append each of these new elements to the carousel

      Carousel.appendCarousel(carouselItem);

    });

    Carousel.start();

/* Part 2 - Item 10 
Test your site, thoroughly! What happens when you try to load the Malayan breed? Not every breed has the same data
available, so your code should account for this.
 */

    if (data.length === 0) {
      
      return

    };

// Use the other data you have been given to create an informational section within the infoDump element.

    const breed = data[0].breeds[0];
    infoDump.innerHTML = `<h2>${breed.name}</h2>
    <p><strong>Origin: </strong>${breed.origin}</p>
    <p><strong>Temperament: </strong>${breed.temperament}</p>
    <p><strong>Description: </strong>${breed.description}</p>`;
  }
);

// Part 2 - Item 8

// export async function favourite(imgId) {

//     console.log("Favourite called with id:", imgId)

//     const favourites = await axios.get("/favourites");
//     const existing = favourites.data.find(fav => fav.image_id === imgId);

//     if (existing) {

//         await axios.delete(`/favourites/${existing.id}`);
        
//     } else {

//         await axios.post("/favourites", { image_id: imgId });
        
//     }

// };

