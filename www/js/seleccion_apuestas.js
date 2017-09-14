angular.module('starter.seleccion-apuestas', ['ionic'])

    .controller('apuestasController', function ($scope, $cordovaSQLite, $state,
                                                $ionicPlatform, $ionicPopup, $rootScope,
                                                servicePantallas) {
        $scope.apuestas = [];

        $scope.seleccionParejas = function () {
            $state.go("seleccion_parejas");
        };

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

                    if(apuesta.id == 3){
                        $scope.iSfoursome = true;
                    }

                } else {
                    $cordovaSQLite.execute(db, updateSeleccion, [0, apuesta.id]);
                    if(apuesta.id == 3){
                        $scope.iSfoursome = false;
                    }
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
                            if(result.rows.item(i).id == 3){
                                $scope.iSfoursome = false;
                            }
                        } else {

                            $scope.apuestas.push(new Apuesta(result.rows.item(i).id, result.rows.item(i).nombre, true));
                            if(result.rows.item(i).id == 3){
                                $scope.iSfoursome = true;
                            }
                        }

                    }
                } else {
                    var apuesta = "INSERT INTO apuesta (nombre, seleccionada) VALUES (?,?)";
                    $cordovaSQLite.execute(db, apuesta, ["Units", 0]);
                    $cordovaSQLite.execute(db, apuesta, ["Rabbits", 0]);
                    $cordovaSQLite.execute(db, apuesta, ["Nassau", 0]);

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
