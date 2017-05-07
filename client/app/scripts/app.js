/*jshint node:true, quotmark:false*/
/*global angular,_*/
(function () {

    'use strict';
    var app = angular.module('trantorApp', [
        'ngRoute',
        'angularMoment',
        'ngToast',
        'ui.bootstrap',
        'ui.bootstrap.dropdown',
        'ui.router'
    ]);

    app.run(function ($rootScope, baseUrl, $state, $location) {
        $rootScope.location = $location;
        $rootScope.baseUrl = baseUrl;
    });

    app.config(function ($routeProvider, $httpProvider, baseUrl, $stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('/', {
                    url: '/',
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl',
                    requiresAuthentication: true
                })
                .state('otherwise', {
                    redirectTo: '/'
                });

        })
        .run(function ($rootScope, ngToast) {
            $rootScope.showSuccess = function (msg) {
                ngToast.success({
                    content: msg,
                    timeout: 7000,
                    dismissOnTimeout: true,
                    dismissButton: true,
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                });
            };

            $rootScope.showError = function (error, msg) {
                var content = '';

                if (error.stack) {
                    content = error.stack;
                } else if (typeof (error) === 'object') {
                    content = JSON.stringify(error);
                } else {
                    content = error;
                }

                if (msg) {
                    content += '<br>' + msg;
                }

                ngToast.create({
                    content: 'Error : ' + content,
                    className: 'danger',
                    dismissOnTimeout: false,
                    dismissButton: true,
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                });
            };

        });

})();