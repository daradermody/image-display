describe('image-display', function () {
  let $scope, $controller, $httpBackend;

  beforeEach(module('app'));
  beforeEach(inject(function ($injector) {
      $scope = $injector.get('$rootScope').$new;
      $controller = $injector.get('$controller');
      $httpBackend = $injector.get('$httpBackend');
    })
  );

  describe('imageDisplayParamsController', function () {
    it('retrieves index patterns startup', function () {
      $httpBackend.whenGET('http://localhost:9876/api/image-display/getIndexPatterns')
        .respond(200, [
            {
              "title": "index-1*",
              "fieldFormatMap": {}
            }, {
              "title": "index-2*",
              "fieldFormatMap": {
                "picture": {
                  "id": "url"
                }
              }
            }
          ]
        );

      var controller = $controller('imageDisplayParamsController', {$scope: $scope, $http: $httpBackend});
      $httpBackend.flush(); // Needed to resolve and handle promise returned by $http

      expect($scope.indexPatterns).toEqual(['index-1*', 'index-2*']);

    });
  });

  describe('imageDisplayController', function () {
    it('retrieves image links when vis.params change', function () {
      $httpBackend.whenGET('http://localhost:9876/api/image-display/get/index-1*/1')
        .respond(200, {
            "image": "https://via.placeholder.com/350x150.png",
            "url": "http://doesnt.end/in/dot/png"
          }
        );

      var controller = $controller('imageDisplayController', {$scope: $scope, $http: $httpBackend});
      $scope.vis = {
          params: {
            indexPattern: 'index-1*',
            documentId: '1'
          }
        }

      $httpBackend.flush(); // Needed to resolve and handle promise returned by $http

      expect($scope.data).toEqual([
        {
          'field': 'image',
          'url': 'https://via.placeholder.com/350x150.png'
        }
      ]);
      expect($scope.errorMessage).toEqual('');
      expect($scope.slideNumber).toEqual(0);
    });
  });
});
