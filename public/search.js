type_g = "";
pokemon_name = "";
pokemon_photo = "";
pokemon_id = "";
nameOrID = "";

button_code = "<button class = 'remove_class'> Remove me!</button>";

// function find_photo(data) {
//   pokemon_photo = data.sprites.other["official-artwork"].front_default;
//   pokemon_name = data.name;
//   pokemon_id = data.id;
// }

// async function find_list(pokemonTypeList) {
//   console.log(pokemonTypeList);
//   show_pokemon = "";

//   pokemonList = pokemonTypeList.pokemon;

//   for (i = 0; i < pokemonList.length; i++) {
//     pokemon = pokemonList[i].pokemon.url;

//     if (i % 5 == 0) {
//       show_pokemon += `<div class="images_group">`;
//     }

//     await $.ajax({
//       type: "get",
//       url: pokemon,
//       success: find_photo,
//     });
//     show_pokemon += `<div class='image_container'> <a href="/profile/${pokemon_id}"> ${pokemon_name} <img src="${pokemon_photo}"></a> </div>`;

//     if (i % 5 == 4) {
//       show_pokemon += `</div>`;
//     }
//   }
//   $("main").html(show_pokemon);

//   console.log(pokemonList);
// }

// function processPokemonResp(data) {
//   for (i = 0; i < data.results.length; i++) {
//     if (type_g == data.results[i].name) {
//       type_url = data.results[i].url;
//     }
//   }

//   $.ajax({
//     type: "get",
//     url: type_url,
//     success: find_list,
//   });
// }

function find_type(type) {
  to_add = "";
  $("main").empty();
  // show_pokemon = "";
  // for (i = 1; i <= 100; i++) {
  //   if (i % 5 == 1) {
  //     show_pokemon += `<div class="images_group">`;
  //   }

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
  // }
}
// type_g = type;

// $.ajax({
//   type: "get",
//   url: `https://pokeapi.co/api/v2/type/`,
//   success: processPokemonResp,
// });

async function load_all() {
  to_add = "";
  // for (i = 1; i <= 100; i++) {
  //   if (i % 5 == 1) {
  //     show_pokemon += `<div class="images_group">`;
  //   }

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

// await $.ajax({
//   type: "get",
//   url: `https://pokeapi.co/api/v2/pokemon/${i}`,
//   success: find_photo,
// });
//   show_pokemon += `<div class='image_container'> <a href="/profile/${i}"> ${pokemon_name} <img src="${pokemon_photo}"></a> </div>`;
//   if (i % 5 == 0) {
//     show_pokemon += `</div>`;
//   }
// }

//   $("main").html(show_pokemon);
// }

// async function show_searched_pokemon(data) {
//   $("main").empty(show_pokemon);

//   console.log(data);
//   show_pokemon = "";

//   find_photo(data);

//   show_pokemon += `<div class='image_container'> <a href="/profile/${pokemon_id}"> ${pokemon_name} <img src="${pokemon_photo}"></a> </div>`;

//   $("main").html(show_pokemon);
// }

function insert_profile_event_to_timeline(nameOrID) {
  var now = new Date(Date.now());
  var formatted =
    now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  jQuery.ajax({
    url: "http://localhost:5000/timeline/insert",
    type: "put",
    data: {
      text: `The user has clicked on Pikachu's profile.`,
      time: `${now}`,
      hits: 1,
    },
    success: function (r) {
      console.log(r);
    },
  });
}

function insert_search_event_to_timeline(nameOrID) {
  var now = new Date(Date.now());
  var formatted =
    now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  jQuery.ajax({
    url: "http://localhost:5000/timeline/insert",
    type: "put",
    data: {
      text: `The user has searched the ${nameOrID} pokemon.`,
      time: `${now}`,
      hits: 1,
    },
    success: function (r) {
      console.log(r);
    },
  });
}

function search_pokemon() {
  // to_add = "";

  nameOrID = $("#searchByNameOrID").val();

  history_remove = "<p>" + nameOrID + button_code + "</p>";

  // if (nameOrID == "") {
  load_all();
  // } else {
  // $.ajax({
  //   url: `https://pokeapi.co/api/v2/pokemon/${nameOrID}`,
  //   type: "GET",
  //   success: show_searched_pokemon,
  // });
  // fetch("pikachu.json")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     $("main").empty(show_pokemon);

  //     console.log(data);
  //     show_pokemon = "";

  //     find_photo(data);

  //     show_pokemon += `<div class='image_container'> <a href="/profile/${pokemon_id}"> ${pokemon_name} <img src="${pokemon_photo}"></a> </div>`;

  //     $("main").html(show_pokemon);
  //   });
  // }
  insert_search_event_to_timeline(nameOrID);
  jQuery("#history").append(history_remove);
}

function hide_() {
  $(this).parent().remove();
}

function insert_filter_event_to_timeline(poke_type) {
  var now = new Date(Date.now());
  var formatted =
    now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  jQuery.ajax({
    url: "http://localhost:5000/timeline/insert",
    type: "put",
    data: {
      text: `The user has filter the pokemon by the ${poke_type} type.`,
      time: `${now}`,
      hits: 1,
    },
    success: function (r) {
      console.log(r);
    },
  });
}

function setup() {
  load_all();
  $("#pokemon_type").change(() => {
    poke_type = $("#pokemon_type option:selected").val();
    find_type(poke_type);
    insert_filter_event_to_timeline(poke_type);
  });
  $("body").on("click", "#search", search_pokemon);
  $("body").on("click", ".image_container", insert_profile_event_to_timeline);
  jQuery("body").on("click", ".remove_class", hide_);
}

$(document).ready(setup);
