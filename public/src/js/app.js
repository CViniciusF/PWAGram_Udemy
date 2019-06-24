if ('serviceWorker' in navigator) {
  /* Registering serviceWorker only if the browser (navigator) has the property in it */
  /* it is a Promise */
  /* for the register() it can receive a second parameter that is an object with scope property */
  navigator.serviceWorker.register('/sw.js').then(function() {
    console.log('Service worker registered')
  })
}
