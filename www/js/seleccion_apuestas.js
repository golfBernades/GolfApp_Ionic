angular.module('starter.seleccion-apuestas', ['ionic'])

    .controller('apuestasController', function ($scope, $cordovaSQLite, $state,
                                                $ionicPlatform, $ionicPopup, $rootScope,
                                                servicePantallas) {
        $scope.apuestas = [];

        $scope.seleccionarJuego = function () {
            var selOneCampo = "SELECT id FROM apuesta WHERE seleccionada = 1";
            $cordovaSQLite.execute(db, selOneCampo).then(function (res) {
                if (res.rows.length > 0) {
                    $state.go('juego');
                } else {
                    noSeleccionApuesta();
                }
            });
        };

        $scope.seleccionarCampo = function () {

            if ($rootScope.campos == 1) {
                $state.go('tabs.camp-dis')
            } else {
                $state.go('tabs.camp-cue')
            }
        };

        $scope.apuestaSeleccionada = function (apuesta) {

            var updateSeleccion = "UPDATE apuesta SET seleccionada = ? WHERE id = ?";
            var selectApuestas = "SELECT seleccionada FROM apuesta WHERE id = ?";
            $cordovaSQLite.execute(db, selectApuestas, [apuesta.id]).then(function (res) {

                if (res.rows.item(0).seleccionada == 0) {
                    $cordovaSQLite.execute(db, updateSeleccion, [1, apuesta.id]);
                } else {
                    $cordovaSQLite.execute(db, updateSeleccion, [0, apuesta.id]);
                }

            });
        };

        function getApuestas() {

            var query = "SELECT * FROM apuesta ORDER BY nombre ASC";
            $cordovaSQLite.execute(db, query).then(function (result) {
                if (result.rows.length > 0) {
                    for (var i = 0; i < result.rows.length; i++) {
                        if (result.rows.item(i).seleccionada == 0) {

                            $scope.apuestas.push(new Apuesta(result.rows.item(i).id, result.rows.item(i).nombre, false));
                        } else {
                            $scope.apuestas.push(new Apuesta(result.rows.item(i).id, result.rows.item(i).nombre, true));
                        }
                    }
                } else {
                    var apuesta = "INSERT INTO apuesta (nombre, seleccionada) VALUES (?,?)";
                    $cordovaSQLite.execute(db, apuesta, ["Rayas", 0]);
                    $cordovaSQLite.execute(db, apuesta, ["Coneja", 0]);

                    getApuestas();
                }
            }, function (err) {
                console.error(err);
            });

        }

        function noSeleccionApuesta() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Apuesta no seleccionada',
                template: 'No has seleccionado niguna apuesta. Deseas avanzar?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    $state.go('juego');
                }
            });
        };

        $ionicPlatform.ready(function () {
            getApuestas();
        });

    });
