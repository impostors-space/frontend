var cookieObject = JSON.parse(atob(document.cookie.replace("data=", "")));

var text = document.getElementById("text");
var nextButton = document.getElementById("nextButton");
var commentButton = document.getElementById("commentButton");
var currentPostId = null;

console.log(cookieObject);

var requestOptions = {
  method: "GET",
  headers: cookieObject["headers"],
};

console.log(requestOptions);

function upvote(comment_uuid) {
  var upvoteRequestOptions = {
    method: "PUT",
    headers: cookieObject["headers"],
    body: "1",
  };

  fetch(
    `https://impostors.api.pauljako.de/api/v1/comment/${comment_uuid}/vote`,
    upvoteRequestOptions,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      reloadPost();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function downvote(comment_uuid) {
  var upvoteRequestOptions = {
    method: "PUT",
    headers: cookieObject["headers"],
    body: "-1",
  };

  fetch(
    `https://impostors.api.pauljako.de/api/v1/comment/${comment_uuid}/vote`,
    upvoteRequestOptions,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      reloadPost();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function neutral(comment_uuid) {
  var upvoteRequestOptions = {
    method: "PUT",
    headers: cookieObject["headers"],
    body: "0",
  };

  fetch(
    `https://impostors.api.pauljako.de/api/v1/comment/${comment_uuid}/vote`,
    upvoteRequestOptions,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      reloadPost();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

currentPostId = await getPost();

nextButton.addEventListener("click", async function () {
  var new_postId = await getPost();

  if (new_postId === currentPostId) {
    new_postId = await getPost();
  }

  if (new_postId === currentPostId) {
    new_postId = await getPost();
  }

  if (new_postId === currentPostId) {
    new_postId = await getPost();
  }

  currentPostId = new_postId;
});

commentButton.addEventListener("click", async function () {
  commentOnPost();
});

async function commentOnPost() {
  var comment = document.getElementById("commentField").value;

  if (comment.length === 0) {
    alert("Please enter a comment");
    return;
  }

  var post_uuid = currentPostId;

  await fetch(
    `https://impostors.api.pauljako.de/api/v1/post/${post_uuid}/comment`,
    {
      method: "POST",
      headers: cookieObject["headers"],
      body: comment,
    },
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      reloadPost();

      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getPost() {
  var post_uuid = null;

  await fetch(
    "https://impostors.api.pauljako.de/api/v1/post/random",
    requestOptions,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      post_uuid = data.uuid;

      if (data.response_type == "impostor") {
        text.style.background = "red";
        text.innerHTML = "You are an impostor!";
      } else {
        text.style.background = "white";
        text.innerHTML = data.content;
      }

      loadComments(data.comments);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return post_uuid;
}

async function reloadPost() {
  await fetch(
    `https://impostors.api.pauljako.de/api/v1/post/${currentPostId}`,
    requestOptions,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      post_uuid = data.uuid;

      if (data.response_type == "impostor") {
        text.style.background = "red";
        text.innerHTML = "You are an impostor!";
      } else {
        text.style.background = "white";
        text.innerHTML = data.content;
      }

      loadComments(data.comments);

      currentPostId = data.uuid;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function loadComments(commentUuids) {
  document.getElementById("comments").innerHTML = "";

  for (var index in commentUuids) {
    var comment_uuid = commentUuids[index];

    await fetch(
      `https://impostors.api.pauljako.de/api/v1/comment/${comment_uuid}`,
      requestOptions,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        var comment = document.createElement("div");
        comment.innerHTML = `
          <div class="comment">
            <br>
            <h5>${data.content}</h5>
            <p>Comment by <a href=/user.html?uuid=${data.author.uuid}>@${data.author.handle}</a></p>
            <div id="Buttons">
              <button onclick="upvote('${data.uuid}')" id="up">&#10004;</button>
              <button id="neutral('${data.uuid}')">&#9473;</button>
              <button id="downvote('${data.uuid}')">&#10006;</button>
            </div>
            <h6>Score: ${data.score}</h6>
          </div>
        `;

        document.getElementById("comments").appendChild(comment);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
