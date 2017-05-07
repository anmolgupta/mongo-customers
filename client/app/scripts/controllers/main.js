'use strict';
/*jshint node:true, quotmark:false*/
/*global angular,_, confirm*/

angular.module('trantorApp')
    .controller('MainCtrl', function ($scope, $http, baseUrl) {
        
        $scope.addEditCustomer = false;

        $scope.saveCustomer = function(customer){
            var method = $http.post;
            if(customer._id){
                method = $http.put;
            }

            method(baseUrl+"/customers", customer).success(()=>{
                $scope.addEditCustomer = false;
            }).error((err)=>{
                $scope.showError(err,"Error in saving cusotmer");
            });
        };


        $scope.openAddEditCustomer = function(customer){

            $scope.addEditCustomer  = true;
            if(!customer){
                $scope.newCustomer = {address:[{}]};
            }else{
                $scope.newCustomer = customer;   
            }
        };

        $scope.filterCustomers = function(){
            $scope.page = 0;
            $scope.getCustomers();

        };

        $scope.filter = {};
        $scope.page = 0;
        var limit = 1;

        $scope.nextPage = function(){
            $scope.page++;
            $scope.getCustomers();
        };

        $scope.previousPage = function(){
            $scope.page--;
            $scope.getCustomers();
        };

        $scope.getCustomers = function(){

            $scope.editCustomers = [];

            $scope.filter.limit  = limit;
            $scope.filter.offset = $scope.page*limit;

            $http.post(baseUrl+"/customers/query", $scope.filter).success((data)=>{
                
                if(data.length){
                    $scope.customers = data;
                }else{
                    $scope.page--;
                }

                if(data.length < limit){
                    $scope.noMorePage = true;
                }else{
                    $scope.noMorePage = false;
                }

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