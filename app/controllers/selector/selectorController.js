/*global filters, swal, chrome, URL, document */
filters.controller('SelectorController', ['$state', '$scope',
function ($state, $scope) {
    $scope.getURL = function () {
        $state.$current.locals.overridePaste = 1;
        swal({
            'title': 'Insert URL here.',
            'type': 'input',
            'showCancelButton': true,
            'closeOnConfirm': false,
            'animation': 'pop',
            'inputPlaceholder': 'http://lorempixel.com/640/480/people/'
        }, function (inputValue) {
            if (inputValue === false) {
                $state.$current.locals.overridePaste = 0;
                return false;
            }
            if (inputValue === '') {
                swal.showInputError('You need to paste an URL here.');
                return false;
            }
            $state.$current.locals.overridePaste = 0;
            $state.go('filters', {
                'src': inputValue
            });
        });
    };

    $scope.getLocalFile = function () {
        chrome.fileSystem.chooseEntry({
            'type': 'openFile',
            'accepts': [{'extensions': ['jpg', 'jpeg', 'png', 'svg', 'bmp']}]
        }, function (entry) {
            if (!entry) {
                return;
            }
            entry.file(function (file) {
                $state.go('filters', {
                    'src': URL.createObjectURL(file),
                    'uri': true
                });
            });
        });
    };

    $scope.getClipboard = function () {
        document.execCommand('paste');
    };
}]);
