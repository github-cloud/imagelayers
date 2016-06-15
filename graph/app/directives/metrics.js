'use strict';

angular.module('iLayers')
  .directive('metrics', ['$timeout', function($timeout) {

    return {
      templateUrl: 'app/views/metrics.html',
      restrict: 'C',
      scope: {
        graph: '='
      },
      controller: function($scope) {
        var self = this;
        $scope.metrics = {
          count: 0,
          size: 0,
          ave: 0,
          largest: 0
        };

        $scope.calculateMetrics = function(layers) {
          var count  = 0, size = 0, ave = 0, largest = 0;
          for (var i=0; i < layers.length; i++) {
            count += 1;
            size += layers[i].Size;
            ave = Math.floor(size / count);
            largest = Math.max(largest, layers[i].Size);
          };
          // animate the numbers
          self.sequential('count', 0, count, 600);
          self.sequential('size', 0, size, 520);
          self.sequential('ave', 0, ave, 520);
          self.sequential('largest', 0, largest, 520);
        };

        // public
        self.sequential = function(key, start, end, duration) {

          var range = end - start;
          var minTimer = 50;

          // calc step time to show all interediate values
          var stepTime = Math.abs(Math.floor(duration / range));

          // never go below minTimer
          stepTime = Math.max(stepTime, minTimer);

          // get current time and calculate desired end time
          var startTime = new Date().getTime();
          var endTime = startTime + duration;
          var timer;

          function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = Math.round(end - (remaining * range));
            $scope.metrics[key] = value;
            if (value != end) {
              $timeout(run, stepTime);
            }
          }

          run();
        };
      },
      link: function(scope, element) {
        scope.$watch('graph', function(graph) {
          var layers = [];
          for (var i=0; i< scope.graph.length; i++) {
              layers = layers.concat(scope.graph[i].layers);
          }

          scope.calculateMetrics(layers);
        });
      }
    }
  }]);
