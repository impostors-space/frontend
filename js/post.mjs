var cookieObject = JSON.parse(atob(document.cookie.replace("data=", "")));

var text = document.getElementById("text");
var nextButton = document.getElementById("nextButton");
var currentPostId = null;

console.log(cookieObject);

var requestOptions = {
  method: "GET",
  headers: cookieObject["headers"],
};

console.log(requestOptions);

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
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return post_uuid;
}

getPost();

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
