angular.module('starter.inicio', ['ionic'])

    .controller('inicioController', function ($scope, $cordovaSQLite, $state, $ionicPlatform) {

        $ionicPlatform.ready(function () {
            console.log('inicioController', 'Ready');
        });

        $scope.guardarPantallaInicio = function (seleccion) {
            console.log('inicioController', 'guardarPantallaInicio');
            var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";

            switch (seleccion) {
                case 2:
                    $cordovaSQLite.execute(db, pantalla, [2]);
                    $state.go('seleccion_jugadores');
                    break;
            }
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
        cargarPantalla();
    });
