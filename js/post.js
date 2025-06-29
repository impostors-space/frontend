var cookieObject = JSON.parse(atob(document.cookie.replace("data=", "")));

var text = document.getElementById("text");
var author = document.getElementById("author");
var nextButton = document.getElementById("nextButton");
var commentButton = document.getElementById("commentButton");
var currentPostId = null;

var requestOptions = {
  method: "GET",
  headers: cookieObject["headers"],
};

console.log(cookieObject);

async function setPostInner(uuid) {
  let response = await fetch(
    `https://impostors.api.pauljako.de/api/v1/post/${uuid}/html`,
    requestOptions,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  text.innerHTML = await response.text();
}

export async function reloadPost() {
  console.log(currentPostId)
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


      if (data.response_type == "impostor") {
        text.style.background = "red";
      } else {
        text.style.background = "white";
      }
      setPostInner(data.uuid);

      author.innerHTML = `Written by <a href="/user.html?uuid=${data.author.uuid}">@${data.author.handle}</a>`;

      loadComments(data.comments);

      currentPostId = data.uuid;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

console.log(requestOptions);

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
      } else {
        text.style.background = "white";
      }

      setPostInner(data.uuid);

      author.innerHTML = `Written by <a href="/user.html?uuid=${data.author.uuid}">@${data.author.handle}</a>`;

      loadComments(data.comments);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return post_uuid;
}

export function vote(comment_uuid, value) {
  var upvoteRequestOptions = {
    method: "PUT",
    headers: { ...cookieObject["headers"] },
    body: value,
  };

  upvoteRequestOptions["headers"]["Content-Type"] = "application/json";

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
      .then(async (data) => {
        console.log(data);

        var comment = document.createElement("div");

        let response = await fetch(
          `https://impostors.api.pauljako.de/api/v1/comment/${comment_uuid}/html`,
          requestOptions,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let commentHTML = await response.text();

        comment.innerHTML = `
          <div class="comment">
            <br>
            <h5>${data.content}</h5>
            <p>Comment by <a href=/user.html?uuid=${data.author.uuid}>@${data.author.handle}</a></p>
            <div id="Buttons">
              <button onclick="window.vote('${data.uuid}', '1')" id="up">&#10004;</button>
              <button onclick="window.vote('${data.uuid}', '0')">&#9473;</button>
              <button onclick="window.vote('${data.uuid}', '-1')">&#10006;</button>
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

window.vote = vote;
