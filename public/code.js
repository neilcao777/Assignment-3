to_add = "";

function processPokeRes(data) {
  //   console.log(data);
  // Step 3: Process the response and get the information
  to_add += `<div class="poke_name"><p>${data.name}<p/></div>
  <br>
   <div class="image_container"> 
   <a href="/profile/${data.id}">
   <img src="${data.sprites.other["official-artwork"].front_default}"> 
   </a>
   </div>`;
}

async function loadNineImages() {
  for (i = 1; i <= 9; i++) {
    // Nine times
    if (i % 3 == 1) {
      // only when i= 1, 4, 7
      to_add += `<div class="images_group">`;
    }
    // Step 1: Generate random pokemon index number
    random_number = Math.floor(Math.random() * 800) + 1;

    // Step 2: Initiate AJAX request from pokemon API
    await $.ajax({
      type: "GET",
      url: `https://pokeapi.co/api/v2/pokemon/${random_number}/`,
      success: processPokeRes,
    });

    if (i % 3 == 0) {
      // only when i= 3, 6, 9
      to_add += `</div>`;
    }
  }
  $("main").html(to_add);
}

function setup() {
  loadNineImages();
  // events handlers
}

$(document).ready(setup);
