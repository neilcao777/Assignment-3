function loadEvents() {
  $.ajax({
    url: "http://localhost:5000/timeline/getAllEvents",
    type: "get",
    success: (x) => {
      console.log(x);
      for (i = 0; i < x.length; i++) {
        $("main").append(
          `
        <div class="wrapper">
          <p>
              Event: ${x[i].text}
          <br><hr>
              Time: ${x[i].time}
          <br><hr>
              Hits: ${x[i].hits}
              <hr>
          <p/>
          <br>
              <button class="LikeButton" id="${x[i]["_id"]}"> Like! </button>
              <button class="DislikeButton" id="${x[i]["_id"]}"> DisLike! </button>
              <button class="DeleteButton" id="${x[i]["_id"]}"> Delete </button>
        </div>
         
          `
        );
      }
    },
  });
}

function deleteData() {
  x = this.id;
  $.ajax({
    url: `http://localhost:5000/timeline/remove/${x}`,
    type: "get",
    success: (e) => {
      console.log(e);
    },
  });
  window.location.reload();
}

function increamentHitsByOne() {
  x = this.id;
  $.ajax({
    url: `http://localhost:5000/timeline/increaseHits/${x}`,
    type: "get",
    success: (e) => {
      console.log(e);
    },
  });

  //   reload the main div
  //   $("main").load(location.href + " main");
  window.location.reload();
}

function decreaseHitsByOne() {
  x = this.id;
  $.ajax({
    url: `http://localhost:5000/timeline/decreaseHits/${x}`,
    type: "get",
    success: (e) => {
      console.log(e);
    },
  });
  window.location.reload();
}

function setup() {
  loadEvents();

  $("body").on("click", ".LikeButton", increamentHitsByOne);
  $("body").on("click", ".DislikeButton", decreaseHitsByOne);
  $("body").on("click", ".DeleteButton", deleteData);
}

$(document).ready(setup);
