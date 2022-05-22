const express = require("express");
// var cors = require("cors");
const app = express();
const bodyparser = require("body-parser");
const pokemon = require("./public/pokemon.js");

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(
  bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);
// app.use(cors());
// app.get("/products/:id", function (req, res, next) {
//   res.json({ msg: "This is CORS-enabled for all origins!" });
// });

// app.listen(80, function () {
//   console.log("CORS-enabled web server listening on port 80");
// });

app.set("view engine", "ejs");

app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
});

// connect to mongodb
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/timelineDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const eventSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String,
});
const eventModel = mongoose.model("timelineevents", eventSchema);

// CRUD
// 1. Read
app.get("/timeline/getAllEvents", function (req, res) {
  // console.log("received a request for "+ req.params.city_name);
  eventModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
});

// 2. Create
app.put("/timeline/insert", function (req, res) {
  console.log(req.body);
  eventModel.create(
    {
      text: req.body.text,
      time: req.body.time,
      hits: req.body.hits,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send(data);
    }
  );
});

// 3. Update
app.get("/timeline/increaseHits/:id", function (req, res) {
  console.log(req.params);
  eventModel.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: { hits: 1 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Updated Successfully");
    }
  );
});

// 3.5 Decrease hits
app.get("/timeline/decreaseHits/:id", function (req, res) {
  console.log(req.params);
  eventModel.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: { hits: -1 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Updated Successfully");
    }
  );
});

// 4. Delete
app.get("/timeline/remove/:id", function (req, res) {
  // console.log(req.params);
  eventModel.remove(
    {
      _id: req.params.id,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Deleted Successfully");
    }
  );
});

const https = require("https");

// json api server from pokemon.js

app.get("/profile/:id", function (req, res) {
  // Filter hp from stats
  filter_hp = pokemon.stats
    .filter((obj_) => {
      return obj_.stat.name == "hp";
    })
    .map((obj2) => {
      return obj2.base_stat;
    });
  // get attack
  filter_attack = pokemon.stats
    .filter((obj_) => {
      return obj_.stat.name == "attack";
    })
    .map((obj2) => {
      return obj2.base_stat;
    });

  // get defense
  filter_defense = pokemon.stats
    .filter((obj_) => {
      return obj_.stat.name == "defense";
    })
    .map((obj2) => {
      return obj2.base_stat;
    });

  // get special attack
  filter_special_attack = pokemon.stats
    .filter((obj_) => {
      return obj_.stat.name == "special-attack";
    })
    .map((obj2) => {
      return obj2.base_stat;
    });

  // get special defense
  filter_special_defense = pokemon.stats
    .filter((obj_) => {
      return obj_.stat.name == "special-defense";
    })
    .map((obj2) => {
      return obj2.base_stat;
    });

  // get speed
  filter_speed = pokemon.stats
    .filter((obj_) => {
      return obj_.stat.name == "speed";
    })
    .map((obj2) => {
      return obj2.base_stat;
    });

  // get abilities
  filter_abilities = [];
  for (i = 0; i < pokemon.abilities.length; i++)
    filter_abilities.push(pokemon.abilities[i].ability.name);

  // get type(s)
  filter_types = [];
  for (i = 0; i < pokemon.types.length; i++)
    filter_types.push(pokemon.types[i].type.name);

  res.render("profile.ejs", {
    id: pokemon.id,
    name: pokemon.name.toUpperCase(),
    hp: filter_hp[0],
    attack: filter_attack[0],
    defense: filter_defense[0],
    special_attack: filter_special_attack[0],
    special_defense: filter_special_defense[0],
    speed: filter_speed[0],
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    type: filter_types,
    ability: filter_abilities,
  });
});

// app.get("/profile/:id", function (req, res) {
//   res.sendFile("public/pokemon.json", { root: __dirname });
//   {
//     if (err) {
//       console.log("Error " + err);
//     } else {
//       console.log("Sent");
//     }
//   }
// });

// app.listen(5100, function (err) {
//   if (err) console.log(err);
//   console.log("Server listening on PORT", 5100);
// });

//     .then((response) => response.json())
//     .then((data) => {
//       // console.log(data.name.toUpperCase());
//       // console.log(data.id);
//       // console.log(data.height / 10);

//       // Filter hp from stats
//       filter_hp = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "hp";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get attack
//       filter_attack = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "attack";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get defense
//       filter_defense = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "defense";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get special attack
//       filter_special_attack = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "special-attack";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get special defense
//       filter_special_defense = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "special-defense";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get speed
//       filter_speed = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "speed";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get abilities
//       filter_abilities = [];
//       for (i = 0; i < data.abilities.length; i++)
//         filter_abilities.push(data.abilities[i].ability.name);

//       // get type(s)
//       filter_types = [];
//       for (i = 0; i < data.types.length; i++)
//         filter_types.push(data.types[i].type.name);

//       res.render("profile.ejs", {
//         id: data.id,
//         name: data.name.toUpperCase(),
//         hp: filter_hp[0],
//         attack: filter_attack[0],
//         defense: filter_defense[0],
//         special_attack: filter_special_attack[0],
//         special_defense: filter_special_defense[0],
//         speed: filter_speed[0],
//         height: data.height / 10,
//         weight: data.weight / 10,
//         type: filter_types,
//         ability: filter_abilities,
//       });
//     });
// });

// app.get("/profile/:id", function (req, res) {
//   const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
//   data = "";
//   https.get(url, function (https_res) {
//     https_res.on("data", function (chunk) {
//       // console.log(data);
//       data += chunk;
//     });
//     https_res.on("end", function () {
//       data = JSON.parse(data);
//       console.log(data);

//       // Filter hp from stats
//       filter_hp = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "hp";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get attack
//       filter_attack = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "attack";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get defense
//       filter_defense = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "defense";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get special attack
//       filter_special_attack = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "special-attack";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get special defense
//       filter_special_defense = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "special-defense";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get speed
//       filter_speed = data.stats
//         .filter((obj_) => {
//           return obj_.stat.name == "speed";
//         })
//         .map((obj2) => {
//           return obj2.base_stat;
//         });

//       // get abilities
//       filter_abilities = [];
//       for (i = 0; i < data.abilities.length; i++)
//         filter_abilities.push(data.abilities[i].ability.name);

//       // get type(s)
//       filter_types = [];
//       for (i = 0; i < data.types.length; i++)
//         filter_types.push(data.types[i].type.name);

//       res.render("profile.ejs", {
//         id: req.params.id,
//         name: data.name.toUpperCase(),
//         hp: filter_hp[0],
//         attack: filter_attack[0],
//         defense: filter_defense[0],
//         special_attack: filter_special_attack[0],
//         special_defense: filter_special_defense[0],
//         speed: filter_speed[0],
//         height: data.height / 10,
//         weight: data.weight / 10,
//         type: filter_types,
//         ability: filter_abilities,
//       });
//     });
//   });
// });
