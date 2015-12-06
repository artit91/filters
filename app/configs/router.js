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

    $stateProvider.state('save', {
        'url': '/save?src&original',
        'views': {
            'body': {
                'templateUrl': 'save.tpl.html',
                'controller': 'saveController'
            }
        }
    });
}]);
