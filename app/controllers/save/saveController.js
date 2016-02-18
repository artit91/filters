/*global filters, escape, window, chrome */
filters.controller('saveController', [
    'utils',
    '$stateParams',
    '$state',
    '$scope',
    function (utils, $stateParams, $state, $scope) {
        $scope.image = $stateParams.src;

        $scope.back = function () {
            $state.go('filters', {
                'src': $stateParams.original,
                'uri': true,
                'filter': $stateParams.filter
            });
        };

        $scope.open = function () {
            window.open($scope.image);
        };

        $scope.save = function () {
            var blob = utils.dataURItoBlob($scope.image),
                fileName = 'capture.png';

            chrome.fileSystem.chooseEntry(
                {
                    'type': 'saveFile',
                    'suggestedName': fileName,
                    'accepts': [
                        {
                            'mimeTypes': ['image/png'],
                            'extensions': ['png']
                        }
                    ]
                },
                function (writableFileEntry) {
                    writableFileEntry.createWriter(
                        function (writer) {
                            writer.onerror = function () {};
                            writer.onwriteend = function () {};
                            writer.write(blob);
                        },
                        function (err) {
                            console.error(err);
                        }
                    );
                }
            );
        };
    }
]);
