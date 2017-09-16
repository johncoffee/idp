'use strict'

document.addEventListener('keypress', (event) => {
  if (event.keyCode === 116) {
    sessionStorage.removeItem('items')
    sessionStorage[ 'items message ' ] = 'items cache was cleared with F5 on ' + new Date()
  }
})

function uninstall () {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    if (!Array.from(registrations).length ) console.log("no service workers")

    for(let registration of registrations) {
      registration.unregister()
      console.debug("service worker uninstalled", registration)
    } })
}
