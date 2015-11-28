/*global filters*/
filters.config(['$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/selector');

    $stateProvider.state('selector', {
        'url': '/selector',
        'views': {
            'body': {
                'templateUrl': 'selector.tpl.html',
                'controller': 'SelectorController'
            }
        }
    });

    $stateProvider.state('filters', {
        'url': '/filters?src&uri',
        'views': {
            'body': {
                'templateUrl': 'filters.tpl.html',
                'controller': 'filtersController'
            }
        }
    });
}]);
