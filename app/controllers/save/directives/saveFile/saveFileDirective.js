/*global filters */
filters.directive('saveFile', [
    function () {
        return {
            'restrict': 'E',
            'scope': {
                'model': '=ngModel'
            },
            'link': function ($scope, $element) {
                $scope.$watch('model', function (model) {
                    $element[0].style.backgroundImage = 'url(' +
                        model +
                        ')';
                });
            }
        };
    }
]);
