let defferredPrompt

//polyfill
if (!window.Promise) {
  window.Promise = Promise
}

if ("serviceWorker" in navigator) {
  /* Registering serviceWorker only if the browser (navigator) has the property in it
  it is a Promise
  for the register() it can receive a second parameter that is an object with scope property
   they only work when served by https (localhost is an exception) */
  navigator.serviceWorker
    .register("/sw.js")
    .then(function () {
      console.log("Service worker registered")
    })
    .catch(function (err) {
      console.log(err)
    })
}

// Before asking to add the application to homescreen, we can preventDefault
window.addEventListener("beforeinstallprompt", function (event) {
  console.log("beforeinstallprompt fired")
  event.preventDefault()
  defferredPrompt = event
  return false
})

//Promises study.
// var promise = new Promise(function(resolve, reject) {
//   setTimeout(function() {
//     resolve('Promise resolved')
//     //reject
//   }, 3000)
// })
// promise.then(function(textOnResolve) {
//   console.log(textOnResolve)
// })
// promise.catch()

//Fetch study.
//GET
// fetch('https://httpbin.org/ip')
//   .then((response) => {
//     console.log(response);
//     //As the response from the api is a ReadableStream, we need to parse it
//     // to a js object, and it is an async task, so we can chain a .then()
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   })

//POST
// fetch('https://httpbin.org/post', {
//   //options for the request
//   //GET is default for method property
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     //it depends on the API, we dont need to manually set it
//     'Accept': 'application/json'
//   },
//   //mode: cors, no-cors

//   //we need json.stringify here because we are sending a Javascript Object,
//   //but the content type is set to application/json so we need to parse it to JSON
//   body: JSON.stringify({
//     message: 'Does this works?'
//   })
// })
//   .then((response) => {
//     console.log(response);
//     //As the response from the api is a ReadableStream, we need to parse it
//     // to a js object, and it is an async task, so we can chain a .then()
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   })

//AJAX vs FETCH

//Ajax doesn't works on SWs because it uses a lot of synchronous code
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://httpbin.org/ip');
// xhr.responseType = 'json';

// xhr.onload = function() {
//   console.log(xhr.response);
// }

// xhr.onerror = function() {
//   console.log('Error');
// }
// //this makes the call
// xhr.send();
