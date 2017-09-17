angular.module("app", ['ngMaterial'])

angular.module("app").config(function ($mdThemingProvider, $locationProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('blue')

    $locationProvider.html5Mode(true)
})

angular.module('app').component('plankApp', {
  template: `
<div style="background: #75436e; color: #fff;" layout="row" layout-padding layout-align="center center">
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
  controller: function ($location) {
      const searchObject = $location.search()
      if (searchObject.apikey) {
          sessionStorage.apikey = searchObject.apikey
          $location.search("apikey", '')
      }

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
      <h2>Build form; select validators</h2>                               
      <md-content layout-padding>
        <md-grid-list
            md-cols-gt-md="12" md-cols="3" md-cols-md="8"
            md-row-height="1:1"
            md-gutter-gt-md="16px" md-gutter-md="8px" md-gutter="4px">
          <md-grid-tile
              ng-repeat="tile in types"
              ng-style="{'background': tile.selected ? '#A4FFA7' : '#FFC8BF'}"              
              ng-click="tile.selected = !tile.selected">
              <span ng-bind="::tile.title" style="font-weight: bold"></span>
          </md-grid-tile>
        </md-grid-list>
      </md-content>
      
      <h3>Requirements</h3>      
      <p ng-show="">Client has to provide</p>
      <p>Client has to provide</p>
      
      <input type="number" ng-model="$ctrl.mustSelect"> (of {{ $ctrl.getSelected(types) }})
         
      <p style="text-align: right">
        <md-button class="md-primary md-raised" ng-click="$ctrl.save()">save</md-button>       
      </p>   
</md-content>     
    
`,
  controller: function ($scope) {
    const list = $scope.list = []
    const types = $scope.types = [
        {title: "DAWA address", img: "", },
        {title: "CVR number", img: "", },
        {title: "Photo ID upload", img: "", },
        {title: "Motorregistret", img: "", },
        {title: "NemID", img: "", },
        {title: "Facebook", img: "", },
    ]
    this.mustSelect = 2
    this.getSelected = (list) => list.filter(i => !!i.selected).length
    this.save = () => sessionStorage.route = Routes.CASES

  },
})

angular.module('app').component('casesList', {
  template: `
    <md-content layout-padding>
        <h2>Case list</h2>
        <div ng-repeat="item in list">
            <div ng-bind="::item.title" ng-click="$ctrl.doStuff()">           
            </div>              
        </div>   
</md-content>
    
`,
  controller: function ($scope) {
    const list = $scope.list = []

    list.push({
        title: "Case data #1 - received"
      },{
        title: "Case data #2 - received"
      },{
        title: "Case data #3 - pending"
      },
    )

    this.doStuff = () => {
        sessionStorage.route = Routes.FORM
    }
  },
})
