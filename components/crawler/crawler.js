function Crawler(StarWarsService, $q, $timeout, $rootScope) {
    const ctrl = this;
    
    ctrl.$onInit = function() {
        ctrl.crawler = [];
        ctrl.show = false;
    };

    $rootScope.$on("$locationChangeSuccess", function(value) {
        ctrl.crawler = [];
        ctrl.show = false;

        ctrl.getStarWarsCrawler()
        .then( _ => ctrl.show = true ); 
    });

    ctrl.getStarWarsCrawler = () => {
        // call star wars API
        // attach to template one by one
        return $q(function(resolve, reject) {
             StarWarsService.callStarWarsAPI()
            .then( (response) => {
                ctrl.crawler.push(`Episode ${response.data.episode_id}: ${response.data.title}`);

                let crawlerData = response.data.opening_crawl.split('\n');
                ctrl.addToCrawler(crawlerData, 0, resolve);
            });   
        });
    }

    ctrl.nextEpisode = () => {
        StarWarsService.nextEpisode();
    }

    ctrl.previousEpisode = () => {
        StarWarsService.previousEpisode();
    }

    ctrl.addToCrawler = (crawlerData, index, resolve) => {

        if ( index === crawlerData.length ) {
            $timeout( () => {
                resolve();
            }, 800)
        } else {
            $timeout( () => {
                ctrl.crawler.push(crawlerData[index]);
            }, 800)
            .then( _ => {
                index++;
            
                ctrl.addToCrawler(crawlerData, index, resolve)
             })
        }
    }
  }
  
  angular.module('StarWarsCrawler').component('crawler', {
    template: `
    
        <p ng-repeat="text in $ctrl.crawler track by $index">{{text}}</p>
        <p ng-if="$ctrl.show">
            <button ng-click="$ctrl.previousEpisode()">Previous Episode</button> 
            <button ng-click="$ctrl.nextEpisode()">Next Episode</button> 
        </p>

    `, // or use templateUrl
    controller: Crawler,
    bindings: {
      me: '<',
      onDelete: '&',
      onUpdate: '&'
    }
});