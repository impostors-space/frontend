
var cookieObject = JSON.parse(document.cookie);

console.log(cookieObject)

var afterBasicPreAuthString = cookieObject.uname + ":" + cookieObject.pswHash;

var requestOptions = {
    method: 'GET',
    headers: {
      Authorization: btoa(`Basic ${afterBasicPreAuthString}`),
    },
}

console.log(requestOptions)

fetch("https://impostors.api.pauljako.de/api/v1/post/next", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
  });