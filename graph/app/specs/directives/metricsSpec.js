describe('Metrics Directive', function() {
  // Load the module
  beforeEach(module('iLayers'));
  // Load the templates
  beforeEach(module('app/views/metrics.html'));

  var directive, scope, controller, layers;

  beforeEach(inject(function ($compile, $rootScope) {
    var elem = angular.element("<section class='metrics' graph='graph'></section>");
    scope = $rootScope.$new();
    scope.graph = [];
    directive = $compile(elem)(scope);
    scope.$digest();
    controller = elem.controller('metrics');
  }));

  it('should initialize metrics', function() {
     expect(angular
             .equals(directive.isolateScope().metrics, { count: 0, size: 0, ave: 0, largest:0 }))
             .toBeTruthy();
  });

  describe('calculateMetrics', function() {
    beforeEach(function() {
      spyOn(controller, "sequential");

      layers = [
        { name: 'foo', Size: 300 },
        { name: 'baz', Size: 200 },
        { name: 'bar', Size: 1000 }
      ]
    });

    it('should call sequential with the total layer count', function() {
      directive.isolateScope().calculateMetrics(layers);
      expect(controller.sequential).toHaveBeenCalledWith('count', 0, 3, 600);
    });

    it('should call sequential with the total layer size', function() {
      directive.isolateScope().calculateMetrics(layers);
      expect(controller.sequential).toHaveBeenCalledWith('size', 0, 1500, 520);
    });

    it('should call sequential with the layer average', function() {
      directive.isolateScope().calculateMetrics(layers);
      expect(controller.sequential).toHaveBeenCalledWith('ave', 0, 500, 520);
    });

    it('should call sequential with the largest layer size', function() {
      directive.isolateScope().calculateMetrics(layers);
      expect(controller.sequential).toHaveBeenCalledWith('largest', 0, 1000, 520);
    });
  });
});
