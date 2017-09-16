angular.module("app", ['ngMaterial'])

angular.module("app").config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('blue')
})

angular.module('app').component('plankApp', {
  template: `
    <create-form ng-if="$ctrl.route == ${Routes.FORM}"></create-form>
`,
  controller: function () {
    Object.defineProperty(this, 'route', {
      get: () => sessionStorage.route,
      set: (value) => sessionStorage.route = value,
    })
    if (!this.route) {
      // default route
      this.route = Routes.FORM
    }
  },
})
