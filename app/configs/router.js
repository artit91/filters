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
        'url': '/filters',
        'params': {
            'src': null,
            'uri': 0,
            'filter': 'default'
        },
        'views': {
            'body': {
                'templateUrl': 'filters.tpl.html',
                'controller': 'filtersController'
            }
        }
    });

    $stateProvider.state('save', {
        'url': '/save',
        'params': {
            'src': null,
            'original': null,
            'filter': 'default'
        },
        'views': {
            'body': {
                'templateUrl': 'save.tpl.html',
                'controller': 'saveController'
            }
        }
    });
}]);
