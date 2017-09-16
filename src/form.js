angular.module('app').component('createForm', {
    template: `
<md-content layout-padding>
    <h2>Customer <span ng-bind="data.id"></span> </h2>
    <p>Information received <b ng-bind="data.date"></b></p>
</md-content>

<div layout="column" ng-cloak class="md-inline-form">
  <md-content layout-padding>
      <form name="userForm">
        <h4>#1 Company owner</h4>
          
        <div layout-gt-xs="row">
          <md-input-container class="md-block" flex-gt-xs>
            <label>Company CVR</label>
            <input ng-model="data.cvr" type="number" minlength="8" maxlength="8" ng-change="$ctrl.lookupCvr(data.cvr)" ng-model-options="{debounce: 333}">
          </md-input-container>          
        </div>
                
        <div layout-gt-sm="row">
            <div ng-if="data.owners">
                Virk.dk - owner(s) of CVR 28319436: <strong ng-bind="data.owners"></strong>
            </div>
        </div>                    
      </form>
  </md-content>
  
<md-content class="md-padding" layout-xs="column" layout="row">
    <h4>#2 Picture of ID document</h4>
</md-content>

<md-content class="md-padding" layout-xs="column" layout="row">
    <div flex-xs flex-gt-xs="50" layout="column">
          <md-card>
            <img ng-src="{{data.image}}" class="md-card-image" alt="image of id">
            <!--<md-card-title>-->
              <!--&lt;!&ndash;<md-card-title-text>&ndash;&gt;-->
                <!--&lt;!&ndash;<span class="md-headline">Action buttons</span>&ndash;&gt;-->
              <!--&lt;!&ndash;</md-card-title-text>&ndash;&gt;-->
            <!--</md-card-title>-->
                <md-card-content>
                  <p>
                      User-uploaded image.
                  </p>
            </md-card-content>       
        </md-card>
  </div>
  
</md-content>

<md-content>
  <p>
      <md-button ng-click="$ctrl.print()" class="md-raised">Save report to cloud</md-button>
  </p>
</md-content>

</div>       
`,
    controller: function ($scope) {
        const data = this.data = $scope.data = {
            id: 28319436,
            cvr: 28319436,
            date: new Date().toDateString(),
            // image: `//api.typeform.com/v1/form/DZ1iMw?key=${sessionStorage.key}&completed=true`,
            image: ``,
        }

        this.getLatestResponse = () => {
            const url = `https://api.typeform.com/v1/form/DZ1iMw?key=${sessionStorage.apikey}&completed=true`
            fetch(url)
                .then(res => res.json(),
                    reason => console.warn(reason)
                )
                .then(json => {
                    $scope.$apply(() => {
                        console.debug(json.responses)
                        if (json.responses instanceof Array && json.responses.length > 0) {
                            const latest = json.responses[json.responses.length-1]

                            console.debug(latest)
                            data.image = latest.answers.fileupload_61070177
                            data.cvr = parseInt(latest.answers.textfield_61074806, 10)
                            this.lookupCvr(data.cvr)
                        }
                    })
                })
                .catch(error => console.warn(error))
        }

        setTimeout(()=>{this.getLatestResponse()},1)

        this.lookupCvr = (newVal) => {
            console.debug(`lookup cvr...`)
            fetch(`https://cvrapi.dk/api?search=${newVal}&country=dk`)
                .then(res => res.json(),
                      reason => console.warn(reason)
                )
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

        this.print = () => {window.print()}
    },
})
