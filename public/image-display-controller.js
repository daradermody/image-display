import {uiModules} from 'ui/modules';
import isAbsoluteUrl from 'is-absolute-url';

uiModules
  .get('kibana/image-display', ['kibana'])
  .controller('imageDisplayParamsController', ($scope, $http) => {
    $http.get(`../api/image-display/getIndexPatterns`)
      .then((response) => response.data)
      .then(getUrlFields)
      .then(data => $scope.indexPatterns = data)
      .catch(error => {
        console.error(error);
      });

    function getUrlFields(data) {
      for (const indexPattern of data) {
        indexPattern.urlFields = []
        for (const [field, mapping] of Object.entries(indexPattern.fieldFormatMap)) {
          if (mapping.id === 'url') {
            indexPattern.urlFields.push(field);
          }
        }
        delete indexPattern.fieldFormatMap;
      }
      return data;
    }
  })

  .controller('imageDisplayController', ($scope, $http) => {
    $scope.updateSlideNumber = (numberToAdd) => {
      $scope.slideNumber = mod($scope.slideNumber + numberToAdd, $scope.data.length);
    }

    function mod(n, m) {
      return ((n % m) + m) % m;
    }

    $scope.$watch('vis.params', params => {
      $scope.data = [];
      $scope.slideNumber = 0;
      $scope.errorMessage = '';

      if (!(params.indexPattern && params.documentId)) {
        return;
      }

      if (!params.indexPattern.urlFields.length) {
        $scope.errorMessage = `No URL formatted fields detected for ${params.indexPattern.title}`;
        return;
      }

      getImageData(params.indexPattern, params.documentId)
        .then(data => $scope.data = data)
        .catch(error => $scope.errorMessage = error.message);
    });

    function getImageData(indexPattern, documentId) {
      return $http.post(`../api/image-display/get/${indexPattern.title}/${documentId}`, {fields: indexPattern.urlFields})
        .then(response => response.data)
        .then(removeUnsupportedFields)
        .catch(error => {
          throw new Error('There was an error retrieving data: ' + ((error.hasOwnProperty('data')) ? error.data: error.message));
        });
    }

    function verifyParameters(params) {
      if (!params.indexPattern.urlFields.length) {
        throw new Error(`No URL formatted fields detected for ${params.indexPattern.title}`);
      }
    }

    function removeUnsupportedFields(data) {
      const imageFields = [];
      for (const [field, value] of Object.entries(data)) {
        if (isAbsoluteUrl(value) && value.endsWith('.png')) {
          imageFields.push({
            'field': field,
            'url': value
          })
        }
      }
      if (!imageFields.length) {
        throw new Error('No fields in this document has have PNG images');
      }
      return imageFields;
    }
  });
