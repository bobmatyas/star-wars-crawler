function EpisodeCounter(StarWarsService, $rootScope) {
    const ctrl = this;
    
    ctrl.getEpisode = function() {
        return StarWarsService.getEpisode();
    };

    $rootScope.$on("$locationChangeSuccess", function(value) {
        ctrl.getEpisode()
    });
  }
  
  angular.module('StarWarsCrawler').component('episodeCounter', {
    template: `
        <h2> Movie #{{$ctrl.getEpisode()}} </h2>
    `, // or use templateUrl
    controller: EpisodeCounter,
});