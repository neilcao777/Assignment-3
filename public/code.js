to_add = "";

function processPokeRes() {
  //   console.log(pokemon);
  // Step 3: Process the response and get the information

  fetch("pikachu.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.name);
      to_add += `<div class="poke_name"><p>${data.name}<p/></div>
  <br>
   <div class="image_container"> 
   <a href="/profile/${data.id}">
   <img src="${data.sprites.other["official-artwork"].front_default}"> 
   </a>
   </div>`;
      $("main").html(to_add);
    });
}

function setup() {
  processPokeRes();
}

$(document).ready(setup);
