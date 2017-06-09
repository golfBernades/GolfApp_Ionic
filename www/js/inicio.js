angular.module('starter.inicio', ['ionic'])

    .controller('inicioController', function ($scope, $cordovaSQLite, $state, $ionicPlatform, $ionicPopup) {

        $scope.funcionUser = "";
        $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";
        var sesion;

        $scope.guardarPantallaInicio = function (seleccion) {
            console.log('inicioController', 'guardarPantallaInicio');
            var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";

            switch (seleccion) {
                case 2:
                    sesion= true;
                    if(sesion){
                        $cordovaSQLite.execute(db, pantalla, [2]);
                        $state.go('seleccion_jugadores');
                    }else{
                        confirmSesion()
                    }
                    break;
            }
        };

        function confirmSesion () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Iniciar Sesión',
                template: 'Para poder avanzar deves iniciar sesión',
                okText:'Iniciar Sesión',
                cancelText: 'Cancelar'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    logIn()
                }
            });
        };

        function cargarPantalla() {
            setTimeout(function () {
                var pant = "SELECT * FROM pantalla";
                $cordovaSQLite.execute(db, pant).then(function (res) {
                    if (res.rows.length > 0) {
                        var val = res.rows.item(0).pantalla;
                        direccionPagina(val);
                    } else {
                        var query = "INSERT INTO pantalla (pantalla) VALUES (?)";
                        $cordovaSQLite.execute(db, query, [1])
                    }
                });
            }, 500)
        }

        function direccionPagina(pagina) {
            switch (pagina) {
                case 2:
                    $state.go('seleccion_jugadores');
                    break;
                case 3:
                    $state.go('tabs.camp-dis');
                    break;
                case 4:
                    $state.go('seleccion_apuestas');
                    break;
                case 5:
                    $state.go('nuevo_campo');
                    break;
                case 6:
                    $state.go('juego');
                    break;
                case 7:
                    $state.go('tabs.camp-cue');
                    break;
            }
        }

        function logIn () {
            $state.go('login');
        };

        function logOut () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Cerrar Sesión',
                template: 'Estas seguro de cerrar sesión?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    deleteUser()
                    sesion=false;
                    $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";
                } else {

                }
            });
        };

        function deleteUser() {
            var query = 'DELETE FROM usuario';
            $cordovaSQLite.execute(db, query);
        }

        function isUser() {
            var query = "SELECT id FROM usuario";
            setTimeout(function () {
                $cordovaSQLite.execute(db, query).then(function (res) {
                    console.log(JSON.stringify(res)+" hola")
                    if(res.rows.length>0){
                        sesion = true;
                        $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-out";
                        cargarPantalla();
                    }else{
                        sesion = false;
                        $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";
                    }
                });
            },500)
        }

        $scope.log = function () {
            if(sesion){
                logOut();
            }else{
                logIn();
            }
        }

        $ionicPlatform.ready(function () {
            isUser()
        });

    });
