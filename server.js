const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const express = require("express");
var cors = require("cors");
const app = express();
let userdb;
let totalItems;
let totalAmount;
let userEmail;
var session = require("express-session");
app.use(session({ secret: "ssshhhhh", saveUninitialized: true, resave: true }));

app.set("view engine", "ejs");
const bodyparser = require("body-parser");

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
app.use(cors());
app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

// app.listen(80, function () {
//   console.log("CORS-enabled web server listening on port 80");
// });

app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
});

// login logoff session

// app.get("/welcome", function (req, res) {
//   if (req.session.authenticated) res.redirect("/");
//   else {
//     res.redirect("/login");
//   }
// });

// function auth(req, res, next) {
//   if (req.session.authenticated) next();
//   else {
//     res.redirect("/login");
//   }
// }

// function logger1(req, res, next) {
//   console.log("logger1 got executed!");
//   next();
// }

// function logger2(req, res, next) {
//   console.log("logger2 got executed!");
//   next();
// }

// function logger3(req, res, next) {
//   console.log("logger3 got executed!");
//   next();
// }
// how to declare a global middleware
// app.use(logger2);
// app.use(logger1);

// users = [
//   {
//     email: "neil@bcit.ca",
//     password: "pass1",
//     shoppingCart: [
//       {
//         pokeID: 25,
//         price: 12,
//         quantity: 2,
//       },
//       {
//         pokeID: 35,
//         price: 12,
//         quantity: 4,
//       },
//     ],
//   },
//   {
//     email: "test@bcit.ca",
//     password: "pass2",
//   },
// ];

function authorize(req, res, next) {
  if (req.session.user != undefined) {
    console.log("User Detected");
    req.session.authenticated = true;
    next();
  } else {
    console.log("No User Detected");
    res.status(200).redirect("/login");
  }
}

app.get(
  "/userProfile",
  authorize,
  function (req, res) {
    console.log("email got called");
    userdb
      .collection("userAccounts")
      .find({
        email: { $eq: req.session.user },
      })
      .toArray((err, result) => {
        if (err) throw err;
        console.log(result);
        res.render(__dirname + "/views/userProfile.ejs", {
          session: req.session.authenticated,
          email: result[0].email,
        });
      });
  }

  // (req, res) => {
  //   console.log("email", req.session.user);

  //   if (req.session.authenticated) {
  //     userdb
  //       .collection("userAccounts")
  //       .find({
  //         email: { $eq: req.session.user },
  //       })
  //       .toArray((err, result) => {
  //         if (err) throw err;
  //         console.log(result);
  //         res.render(__dirname + "/views/userProfile.ejs", {
  //           session: req.session.authenticated,
  //           email: result[0].email,
  //         });
  //       });
  //   } else {
  //     res.redirect("/login");
  //   }
  // }
);

// function insert_purchase_event_to_timeline() {
//   var now = new Date(Date.now());
//   var formatted =
//     now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
//   $.ajax({
//     url: "http://localhost:5000/timeline/insert",
//     type: "put",
//     data: {
//       text: `The user has purchased ${totalItems} items with total amount of $ ${totalAmount}.`,
//       time: `${now}`,
//       hits: 1,
//     },
//     success: function (r) {
//       console.log(r);
//     },
//   });
// }

app.post("/checkout", (req, res, next) => {
  var now = new Date(Date.now());
  var formatted =
    now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  $.ajax({
    url: "http://localhost:5000/timeline/insert",
    type: "put",
    data: {
      text: `The user has purchased ${totalItems} items with total amount of $ ${totalAmount}.`,
      time: `${now}`,
      hits: 1,
    },
    success: function (r) {
      console.log(r);
    },
  });

  userdb
    .collection("userAccounts")
    .updateMany(
      { email: { $eq: req.session.user } },
      { $pull: { shoppingCart: {} } },
      { multi: true }
    );
  // res.status(200).send("Checkout Completed.");
  // res.render(__dirname + "/views/history.ejs", {
  //   session: req.session.authenticated,
  //   allItems: totalItems,
  //   allAmount: totalAmount,
  // });
  res.redirect("/");
  next();
});

app.post("/", (req, res, next) => {
  let user;
  let userEmail;
  userdb
    .collection("userAccounts")
    .find({ email: { $eq: req.body.loginEmail } })
    .toArray(function (err, result) {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        user = result[0];
      }

      if (!user) {
        console.log("No email found");
        return;
      } else if (user.password === req.body.loginPass) {
        req.session.authenticated = true;
        req.session.user = req.body.loginEmail;
        userEmail = req.body.loginEmail;
        console.log("login sucessful");

        // get cart items
        to_add = "";
        for (i = 0; i < result[0].shoppingCart.length; i++) {
          to_add += "<table>";
          to_add += "<tr>";

          for (field in result[0].shoppingCart[i]) {
            to_add += "<th>";
            to_add += field;
            to_add += "</th>";
          }
          to_add += "</tr>";
          to_add += "<tr>";

          for (field in result[0].shoppingCart[i]) {
            to_add += "<td>";
            to_add += result[0].shoppingCart[i][field];
            to_add += "</td>";
          }

          to_add += "<tr>";
          to_add += "</table>";
        }

        // calculate total
        subtotal = 0;
        for (i = 0; i < result[0].shoppingCart.length; i++) {
          subtotal +=
            result[0].shoppingCart[i].price *
            result[0].shoppingCart[i].quantity;
        }
        subtotal_string = (Math.round(subtotal * 100) / 100).toFixed(2);

        // calculate GST
        gst = subtotal * 0.05;
        gst_string = (Math.round(gst * 100) / 100).toFixed(2);
        // calculate PST
        pst = subtotal * 0.07;
        pst_string = (Math.round(pst * 100) / 100).toFixed(2);
        // calculate total
        total = subtotal + gst + pst;
        total_string = (Math.round(total * 100) / 100).toFixed(2);

        // global variable
        totalItems = result[0].shoppingCart.length;
        totalAmount = total_string;

        // render
        res.render(__dirname + "/views/userProfile.ejs", {
          session: req.session.authenticated,
          email: result[0].email,
          name: result[0].name,
          totalItems: result[0].shoppingCart.length,
          shoppingTable: to_add,
          subTotal: subtotal_string,
          gst: gst_string,
          pst: pst_string,
          total: total_string,
        });
        next();
      } else {
        console.log("wrong credentials");
        res.redirect("/login");
      }
    });
});

// app.get("/userProfile/:name", function (req, res) {
//   tmp = "";
//   tmp += `Welcome ${req.params.loginEmail}`;

//   tmp += JSON.stringify(
//     users.filter((x) => x.email == req.params.loginEmail)[0].shoppingCart
//   );
//   res.send(tmp);
// });

app.get("/login/", (req, res) => {
  if (req.session.authenticated) {
    res.render(__dirname + "/views/userProfile.ejs");
    console.log("already have a session");
  } else {
    res.render(__dirname + "/views/login.ejs", {
      session: false,
    });
  }
});

// app.get("/login/:user/:pass", function (req, res, next) {
//   if (
//     users.filter((user) => user.email == req.params.loginEmail)[0].password ==
//     req.params.pass
//   ) {
//     // if (users[req.params.user] == req.params.pass) {
//     req.session.authenticated = true;
//     req.session.user = req.params.user;
//     // res.send("Successful Login!")
//     res.redirect(`/userProfile/${req.session.user}`);
//   } else {
//     req.session.authenticated = false;
//     res.send("Failed Login!");
//   }
// });

// connect to mongodb
const mongoose = require("mongoose");

// connect to timelineDB
mongoose.connect(
  "mongodb://localhost:27017/timelineDB",
  // {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // },
  function (err, db) {
    if (err) {
      throw err;
    }
    userdb = db;
  }
);
const eventSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String,
});
const eventModel = mongoose.model("timelineevents", eventSchema);

// // connect to userAccounts
// const accountSchema = new mongoose.Schema({
//   email: String,
//   password: String,
// });
// const accountModel = mongoose.model("userAccounts", accountSchema);

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

app.get("/profile/:id", function (req, res) {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  data = "";
  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      // console.log(data);
      data += chunk;
    });
    https_res.on("end", function () {
      data = JSON.parse(data);
      console.log(data);

      // Filter hp from stats
      filter_hp = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "hp";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      // get attack
      filter_attack = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "attack";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      // get defense
      filter_defense = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "defense";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      // get special attack
      filter_special_attack = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "special-attack";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      // get special defense
      filter_special_defense = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "special-defense";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      // get speed
      filter_speed = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "speed";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      // get abilities
      filter_abilities = [];
      for (i = 0; i < data.abilities.length; i++)
        filter_abilities.push(data.abilities[i].ability.name);

      // get type(s)
      filter_types = [];
      for (i = 0; i < data.types.length; i++)
        filter_types.push(data.types[i].type.name);

      res.render("profile.ejs", {
        id: req.params.id,
        name: data.name.toUpperCase(),
        hp: filter_hp[0],
        attack: filter_attack[0],
        defense: filter_defense[0],
        special_attack: filter_special_attack[0],
        special_defense: filter_special_defense[0],
        speed: filter_speed[0],
        height: data.height / 10,
        weight: data.weight / 10,
        type: filter_types,
        ability: filter_abilities,
      });
    });
  });
});
