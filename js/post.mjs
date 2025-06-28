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

function getPost() {
  fetch("https://impostors.api.pauljako.de/api/v1/post/random", requestOptions)
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
        text.innerHTML = "You are an impostor!";
      } else {
        text.style.background = "white";
        text.innerHTML = data.content;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

getPost();

nextButton.addEventListener("click", function () {
  getPost();
});
