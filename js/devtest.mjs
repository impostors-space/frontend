var cookieObject = JSON.parse(atob(document.cookie.replace("data=", "")));

console.log(cookieObject);

var requestOptions = {
  method: "GET",
  headers: cookieObject["headers"],
};

console.log(requestOptions);

fetch("https://impostors.api.pauljako.de/api/v1/post/random", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
