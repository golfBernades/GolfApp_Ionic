/**
 * Created by Victor Hugo on 07/06/2017.
 */

angular.module('starter.registro', ['ionic'])

.controller('registroController',function ($scope, $state,$ionicPopup, $http, $ionicLoading) {

    $scope.registro="hola"

    $scope.goInicio = function(){
        $state.go('inicio')
    };

    $scope.goRegistro = function(){
        $state.go('inicio')
    };

    $scope.goLogin = function(){
        $state.go('login')
    };




    $scope.registro = function (correo, password, passwordConf) {
        console.log(correo,password,passwordConf);
        var datos = false;
        if(correo==null || password==null || passwordConf==null ){
            popup("Campos Vacios","Llenar todos los campos vacios.")
        }else{
            if(password!=passwordConf){
                popup("Contraseñas incorrectas","Verificar las contraseñas.")
            }else{
                datos = true;
            }
        }

        if(datos){
            showLoading();
            consultarCorreo(0)
        }

    };

    function consultarCorreo(intento) {

        var httpRequest = {
            method: 'POST',
            url: 'http://192.168.1.101:8000/usuario_exists',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {email: $scope.registro.correo},
            timeout: 3000
        };

        $http(httpRequest)
            .then(function successCallback(response) {

                if(!response.data.existe){
                        insertarUsuario(0)
                }else{
                    popup("Correo ocupado",$scope.registro.correo+ " correo ocupado "+response.data.message)
                    $ionicLoading.hide()
                }
            }, function errorCallback(response) {
                if (intento < 3) {
                    consultarCorreo(intento + 1);
                } else {
                    popup("Error", JSON.stringify(response.data) + "<br>"
                        + " intentos: " + intento);
                    $ionicLoading.hide();
                }
            });
    }

    function insertarUsuario(intento) {

        var httpRequest = {
            method: 'POST',
            url: 'http://192.168.1.101:8000/usuario_insert',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {email: $scope.registro.correo, password: $scope.registro.password},
            timeout: 3000
        };

        $http(httpRequest)
            .then(function successCallback(response) {
                $ionicLoading.hide();


                if(response.data.code == 200){
                    popup("Usuario Insertado","insertado "+ response.data.code)
                }else{
                    popup("Usuario NO Insertado"," NO insertado "+ response.data.code)
                }

            }, function errorCallback(response) {
                if (intento < 3) {
                    insertarUsuario(intento + 1);
                } else {
                    popup("Error", JSON.stringify(response.data) + "<br>"
                        + " intentos: " + intento);
                    $ionicLoading.hide();
                }
            });
    }

    function popup(title, template) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: template
        });
    };

    function showLoading() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>' +
            '<p>Cargando</p>',
            animation: 'fade-in'
        }).then(function () {
            // console.log("The loading indicator is now displayed");
        });
    };
});
