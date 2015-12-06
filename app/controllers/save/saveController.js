/*global filters, escape */
filters.controller('saveController', [
    'utils',
    '$stateParams',
    '$state',
    '$scope',
    function (utils, $stateParams, $state, $scope) {
        $scope.image = decodeURIComponent($stateParams.src);
        $scope.original = decodeURIComponent($stateParams.original);
    }
]);
