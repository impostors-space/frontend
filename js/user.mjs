let cookieObject = JSON.parse(atob(document.cookie.replace("data=", "")));
let pfp = document.getElementById("user-profile-picture");
let username = document.getElementById("username");
let handle = document.getElementById("user-handle-inner"); 

let params = new URLSearchParams(window.location.search);

let query = params.get("uuid")

if (!query) {
    query = params.get("name")
    if (!query) {
        query = cookieObject["uuid"]
    } else {
        query = "@" + query
    }
}

console.log(query)

console.log(cookieObject);

var requestOptions = {
    method: "GET",
    headers: cookieObject["headers"],
};

console.log(requestOptions);

async function reloadUser(user_id) {
    let response = await fetch(`https://impostors.api.pauljako.de/api/v1/user/${user_handle}`, requestOptions);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    let data = await response.json();
    console.log(data);
    username.innerText = data.displayName;
    handle.innerText = data.handle;
}

reloadUser(query)