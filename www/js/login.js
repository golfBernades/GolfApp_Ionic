/**
 * Created by Victor Hugo on 07/06/2017.
 */

angular.module('starter.login', ['ionic'])

.controller('loginController',function ($scope, $state, $ionicPopup, $ionicLoading, $http, $cordovaSQLite) {

    $scope.loginData = {
        correo: 'porfirioads@gmail.com',
        password: 'holamundo'
    };

    $scope.goInicio = function(){
        $state.go('inicio')
    }

    $scope.goLogin = function(){

        var correo = $scope.loginData.correo;
        var password = $scope.loginData.password;

        if(correo== null&& password==null){
            popup("Campos Incompletos","Revisar el correo o el password")
        }else{
            showLoading();
            loginServer(0);
        }
    };

    $scope.goRegistro = function(){
        $state.go('registro')
    };

    function createPostHttpRequest(url, data) {
        var httpRequest = {
            method: 'POST',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "="
                        + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: data,
            timeout: 3000
        };

        return httpRequest;
    }

    function loginServer (intento) {

        var httpRequest = createPostHttpRequest(
             dir+'usuario_login',
            {email: $scope.loginData.correo, password:$scope.loginData.password}
        );

        $http(httpRequest)
            .then(function successCallback(response) {

                $ionicLoading.hide();
                if(response.data.ok){
                    guardarUsuarioPhone();
                    popup('Bienvenido a GolfApp', 'Disfruta todos los privilegios como usuario del sistema.');
                    $state.go('inicio')
                }else{
                    popup('Error', 'Correo o Password incorrectos.');
                }

            }, function errorCallback(response) {
                if(response.status == -1){
                    if (intento < 3) {
                        loginServer(intento + 1);
                    } else {
                        $ionicLoading.hide();
                        popup('Error de conexion', 'No se pudo iniciar sesisón, reintentar mas tarde.')
                    }
                }else{
                    $ionicLoading.hide();
                    popup("error","error")
                }
            });
    }

    function guardarUsuarioPhone() {
        var query = "INSERT INTO usuario (id, email, password) VALUES (?,?,?)";
        $cordovaSQLite.execute(db, query, [1, $scope.loginData.correo, $scope.loginData.password]);
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
