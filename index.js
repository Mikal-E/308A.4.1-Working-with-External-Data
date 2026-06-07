import * as Carousel from "./Carousel.js";
import { API_KEY } from "./keys.js";

// Axios Import Statement Below. Uncommented Provided Statement For Import Use

// import axios from "./axios.js";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Part 2 - Item 1

// Create an async function "initialLoad"

async function initialLoad() {
 
// Retrieve a list of breeds from the cat API using fetch()

  const response = await fetch(`https://api.thecatapi.com/v1/breeds`, {

    headers: { "x-api-key": API_KEY }

    }
  );

    const data = await response.json();

// Checked to see if API was working.

    // console.log(data);

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

// Sets/Clears infoDump element...

  infoDump.innerHTML = "";

// Retrieve information on the selected breed from the cat API using fetch()

  const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreed}`, {

    headers: { "x-api-key": API_KEY }

      }
    ); 

    const data = await response.json();
    console.log(data);

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

/* Part 2 - Item 8
Post to the cat API's favourites endpoint with the given ID. The API documentation gives examples of this
functionality using fetch(); use Axios! Add additional logic to this function such that if the image is
already favourited, you delete that favourite using the API, giving this function "toggle" functionality.
*/

export async function favourite(imgId) {
  
  // console.log("Favourite called with id:", imgId);

    const favourites = await axios.get("/favourites");
    const existing = favourites.data.find(fav => fav.image_id === imgId);

    if (existing) {

        await axios.delete(`/favourites/${existing.id}`);
        
    } else {

        await axios.post("/favourites", { image_id: imgId });
        
    }

}

/* Part 2 - Item 9
Test your favourite() function by creating a getFavourites() function. Use Axios to get all of your favourites
from the cat API. Clear the carousel and display your favourites when the button is clicked.
*/

async function getFavourites() {

  const favourites = await axios.get("/favourites");
  const data = favourites.data;
  // console.log(data);

  Carousel.clear();
  data.forEach(fav => {

    const carouselItem = Carousel.createCarouselItem(

      fav.image.url,
      "Favourite",
      fav.image.id
    );

    Carousel.appendCarousel(carouselItem);

  });
  Carousel.start();
  
};

getFavouritesBtn.addEventListener("click", getFavourites);
