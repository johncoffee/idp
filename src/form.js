angular.module('app').component('createForm', {
    template: `
<md-content layout-padding>
    <h2>KYC data - customer <span ng-bind="data.id"></span> </h2>
    <p>Information received <b ng-bind="data.date"></b></p>
</md-content>

<div layout="column" ng-cloak class="md-inline-form">
  <md-content layout-padding>
    <div>
      <form name="userForm">
        <div layout-gt-xs="row">
          <md-input-container class="md-block" flex-gt-xs>
            <label>Company CVR</label>
            <input ng-model="data.cvr" type="number" minlength="8" maxlength="8" ng-change="$ctrl.lookupCvr(data.cvr)" ng-model-options="{debounce: 333}">
          </md-input-container>          
        </div>
                
        <div layout-gt-sm="row">
            <div>
                Owner(s) <span ng-bind="data.owners"></span>
            </div>
        </div>                    

      </form>
    </div>
  </md-content>

</div>       
`,
    controller: function ($scope) {
        const data = this.data = $scope.data = {
            id: 28319436,
            date: new Date().toDateString(),
        }

        this.lookupCvr = (newVal) => {
            fetch(`https://cvrapi.dk/api?search=${newVal}&country=dk`)
                .then(res => {
                    return res.json()
                },
                reason => {
                    console.warn(reason)
                })
            .then(json => { processCvrData(json) })
            .catch(error => console.warn(error))
        }

        function processCvrData (apiData) {
            console.debug(apiData)
            $scope.$apply(() => {
                if (apiData.owners instanceof Array) {
                    data.owners = apiData.owners.map(owner => owner.name).join(", ")
                    console.log(data)
                }
            })
        }
    },
})
