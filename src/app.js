angular.module("app", ['ngMaterial'])

angular.module("app").config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('blue')
})

angular.module('app').component('plankApp', {
  template: `
<div style="background: #C62828; color: #fff;" layout="row" layout-padding layout-align="center center">
    <h3 flex="grow">APP</h3>
    <div style="white-space: nowrap;">
      <md-button ng-click="$ctrl.route = ${Routes.CREATE}">create</md-button>
      <md-button ng-click="$ctrl.route = ${Routes.CASES}">List</md-button>
    </div>    
</div>
    
    <create-form ng-if="$ctrl.route == ${Routes.FORM}"></create-form>
    <cases-list ng-if="$ctrl.route == ${Routes.CASES}"></cases-list>
    <create-case ng-if="$ctrl.route == ${Routes.CREATE}"></create-case>
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

angular.module('app').component('createCase', {
  template: `
  <md-content layout-padding>
      <h2>Build KYC form</h2>
        
      <p>        
        Elements: <md-button ng-repeat="typ in types" 
                             ng-click="$ctrl.add(typ)" ng-bind="typ"></md-button>
      </p>
        
      <ol style="margin-left: 2rem">
        <li ng-repeat="item in list" 
            ng-bind="::item.title" ng-click="$ctrl.doStuff()"></li>
      </ol>
      
      <p><md-button>save</md-button></p>   
</md-content>
    
`,
  controller: function ($scope) {
    const list = $scope.list = []
    const types = $scope.types = ["dawa","cvr","image upload"]

      this.add = (element) => {
        let el = {}
        list.push(el)
        switch (element) {
            case "dawa":
              el.title = "Dawa address lookup"
              break;
            case "cvr":
              el.title = "CVR number lookup in Virk"
              break;
            case "image upload":
              el.title = "Image upload"
              break;
        }
      }

  },
})

angular.module('app').component('casesList', {
  template: `
    <md-content layout-padding>
        <h2>KYC case list</h2>
        <div ng-repeat="item in list">
            <div ng-bind="::item.title" ng-click="$ctrl.doStuff()">           
            </div>              
        </div>   
</md-content>
    
`,
  controller: function ($scope) {
    const list = $scope.list = []

    list.push({
        title: "KYC data #1 - received"
      },{
        title: "KYC data #2 - received"
      },{
        title: "KYC data #3 - pending"
      },
    )

    this.doStuff = () => {
        sessionStorage.route = Routes.FORM
    }
  },
})
