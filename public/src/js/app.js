var defferredPrompt
if ('serviceWorker' in navigator) {
  /* Registering serviceWorker only if the browser (navigator) has the property in it
  it is a Promise
  for the register() it can receive a second parameter that is an object with scope property
   they only work when served by https (localhost is an exception) */
  navigator.serviceWorker.register('/sw.js').then(function() {
    console.log('Service worker registered')
  })
}

// Before asking to add the application to homescreen, we can preventDefault
window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired')
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
