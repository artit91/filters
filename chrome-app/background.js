/*jslint browser: true, devel: true*/
/*global chrome */

function init() {

    'use strict';

    chrome.app.runtime.onLaunched.addListener(function () {
        chrome.app.window.create('index.html', {
            'id': 'filters',
            'innerBounds': {
                'width': 533,
                'height': 400,
                'minWidth': 533,
                'minHeight': 400
            }
        });
    });

}

init();