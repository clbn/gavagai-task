function termController($scope, $http) {
  $scope.foreTerms = [];
  $scope.backTerms = [];

  $scope.foreLoading = false;
  $scope.backLoading = false;

  $scope.notification = {};

  $scope.windowSizes = [1, 2, 3, 7, 14, 30];
  $scope.windowSize = 7;

  $scope.loadTerms = function() {
    $scope.foreLoading = true;
    $scope.backLoading = true;
    $scope.notification = { 'result': 'loading', 'message': 'Loading associations...' };

    $http
      .get(
        './ethersource/findAssociations' +
          '?timestamp=' + encodeURIComponent($scope.timestamp) +
          '&windowSize=' + $scope.windowSize
      )
      .success(function(data) {
        $scope.foreLoading = false;
        //$scope.notification = { 'result': 'Ok', 'message': 'Associations successfully loaded' };
        $scope.prepareForeTerms(data);
      })
      .error(function(data, status) {
        $scope.foreLoading = false;
        //$scope.notification = { 'result': 'Error', 'message': 'Can\'t load terms: ' + status };
      });

    $http
      .get(
        './ethersource/findBackgroundAssociations' +
          '?timestamp=' + encodeURIComponent($scope.timestamp)
      )
      .success(function(data) {
        $scope.backLoading = false;
        //$scope.notification = { 'result': 'Ok', 'message': 'Associations successfully loaded' };
        $scope.prepareBackTerms(data);
      })
      .error(function(data, status) {
        $scope.backLoading = false;
        //$scope.notification = { 'result': 'Error', 'message': 'Can\'t load terms: ' + status };
      });
  };

  $scope.prepareForeTerms = function(data) {
    $scope.foreTerms = [];
    var topics = data.associationSearchResponse.associationsTopics;
    // Check whether "associationsTopics" exists
    if (topics) {
      // API could return in "associationsTopics" either one topic object or an array of topic objects
      if (!angular.isArray(topics)) {
        topics = [topics];
      }
      angular.forEach(topics, function(topic) {
        var terms = topic.associations;
        // API could return in "associations" either one association object or an array of association objects
        if (!angular.isArray(terms)) {
          terms = [terms];
        }
        angular.forEach(terms, function(term) {
          $scope.foreTerms.push(term);
        });
      });
    }
    $scope.normalizeWeights($scope.foreTerms, 'strength', 0.75, 1.5);
  };

  $scope.prepareBackTerms = function(data) {
    $scope.backTerms = data.ethersourceBackgroundAssociations;
    $scope.normalizeWeights($scope.backTerms, 'occurrenceCount', 0.75, 1.5);
  };

  $scope.normalizeWeights = function(array, property, minLimit, maxLimit) {
    var weights = [];
    angular.forEach(array, function(term) {
      weights.push(term[property]);
    });
    console.log(weights);
    var min = Math.min.apply(null, weights);
    var max = Math.max.apply(null, weights);
    angular.forEach(array, function(term) {
      term.weight = (term[property] - min) / (max - min) * (maxLimit - minLimit) + minLimit;
    });
  };

  $scope.buttonDisabled = function() {
    return $scope.foreLoading || $scope.backLoading;
  };

  $scope.getCurrentTime = function() {
    var date = new Date();
    return date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2) + ' ' +
      ('00' + date.getUTCHours()).slice(-2) + ':' +
      ('00' + date.getUTCMinutes()).slice(-2) + ':' +
      ('00' + date.getUTCSeconds()).slice(-2) +
      ' UTC';
  };

  $scope.timestamp = $scope.getCurrentTime();
}
