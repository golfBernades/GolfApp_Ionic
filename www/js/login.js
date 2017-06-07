/**
 * Created by Victor Hugo on 07/06/2017.
 */

angular.module('starter.login', ['ionic'])

.controller('loginController',function ($scope, $state) {

    $scope.goInicio = function(){
        $state.go('inicio')
    };

    $scope.goRegistro = function(){
        $state.go('registro')
    };
});
