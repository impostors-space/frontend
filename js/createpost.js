
var cookieObject = JSON.parse(atob(document.cookie.replace("data=", "")));

async function createPost(content) {

    await fetch(
        `https://impostors.api.pauljako.de/api/v1/post`,
        {
            method: "POST",
            headers: cookieObject["headers"],
            body: content,
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

var contentField = document.getElementById("content-field")
var submitButton = document.getElementById("submit-button")

submitButton.addEventListener("click", function () {
    createPost(contentField.value)
})
