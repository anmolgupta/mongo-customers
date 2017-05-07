'use strict';
/*jshint node:true, quotmark:false*/
/*global angular,_, confirm*/

angular.module('trantorApp')
    .controller('MainCtrl', function ($scope, $http, baseUrl) {
        
        $scope.addNewCustomer = false;
        $scope.getCustomers = function(){
            $scope.editCustomers = [];

            $http.post(baseUrl+"/customers/query").success((data)=>{
                console.log(data);
                $scope.customers = data;
            }).error((err)=>{
                $scope.showError(err, "Error in getting customers");
            });
        };


        $scope.deleteCustomer = function(id){
            if(!confirm('Are you sure you want to delete?')){
                return;
            }

            $http.delete(baseUrl+"/customers?id="+id).success(()=>{

            }).error((err)=>{
                $scope.showError(err, "Error in deleting customers");
            });
        };


        $scope.updateCustomer = function(customer, $index){
            $http.put(baseUrl+"/customers", customer).success(()=>{
                $scope.editCustomers[$index] = false;
            }).error((err)=>{
                $scope.showError(err, "Error in updating customer");
            });
        };

        $scope.addCustomer = function(customer){
            $http.post(baseUrl+"/customers", customer).success(()=>{
                $scope.addNewCustomer = false;
            }).error((err)=>{
                $scope.showError(err, "Error in adding Customer");
            });
        };

        $scope.getCustomers();
    });