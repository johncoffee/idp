angular.module("app", ['ngMaterial'])

angular.module("app").config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('blue')
})

angular.module('app').component('plankApp', {
  template: `    
    <create-form ng-if="$ctrl.route == ${Routes.FORM}"></create-form>
    <cases-list ng-if="$ctrl.route == ${Routes.CASES}"></cases-list>
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

angular.module('app').component('casesList', {
  template: `
    <md-content>
        <h2>IDP - KYC list</h2>

        <div ng-repeat="item in list">
          <div ng-bind="::item.title" ng-click="$ctrl.doStuff()"></div>
      </div>   
</md-content>
    
`,
  controller: function ($scope) {
    const list = $scope.list = []

    list.push(
        {
        title: "KYC data #1"
      },{
        title: "KYC data #2"
      },{
        title: "KYC data #3"
      },
        )

    this.doStuff = () => {
        sessionStorage.route = Routes.FORM
    }
  },
})
