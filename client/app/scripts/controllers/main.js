'use strict';
/*jshint node:true, quotmark:false*/
/*global angular,_*/

angular.module('trantorApp')
    .controller('MainCtrl', function ($scope, $http, baseUrl) {
        $scope.getCustomers = function(){
            $http.get(baseUrl+"/customers").success((data)=>{
                console.log(data);
                $scope.customers = data;
            }).error((err)=>{
                $scope.showError(err, "Error in getting customers");
            });
        };

        $scope.getCustomers();
    });