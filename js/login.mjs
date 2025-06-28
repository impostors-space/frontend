var apiURL = "https://impostors.api.pauljako.de/api/v1/";

var submitButton = document.getElementById("submit-button");

async function getSHA256Hash(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert to hex
  return hashHex;
}

function getUIIDByUname(uname) {}

async function login(uname, psw) {
  var cookieObject = {
    uname: uname,
    pswHash: await getSHA256Hash(psw),
    uuid: "",
    displayName: "",
    headers: {
      Authorization: "",
    },
  };

  var requestOptions = {
    method: "PUT",
  };

  fetch(
    apiURL +
      "auth/signup?" +
      new URLSearchParams({
        handle: uname,
        displayName: uname,
        passwordHash: cookieObject.pswHash,
      }),
    requestOptions,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      cookieObject.uuid = data.uuid;
      cookieObject.displayName = data.displayName;
      var afterBasicPreAuthString =
        cookieObject.uname + ":" + cookieObject.pswHash;
      (cookieObject.headers.Authorization = `Basic ${btoa(afterBasicPreAuthString)}`),
        console.log(cookieObject);
      document.cookie = "data=" + btoa(JSON.stringify(cookieObject));
      location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

submitButton.addEventListener("click", function () {
  var unameField = document.getElementById("uname-field");
  var pswField = document.getElementById("psw-field");

  login(unameField.value, pswField.value);
});
