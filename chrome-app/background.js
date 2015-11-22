/*jslint browser: true, devel: true*/
/*global chrome */

function init() {

    'use strict';

    chrome.app.runtime.onLaunched.addListener(function () {
        chrome.app.window.create('index.html', {
            'innerBounds': {
                'width': 800,
                'height': 600,
                'minWidth': 533,
                'minHeight': 400
            }
        });
    });

}

init();