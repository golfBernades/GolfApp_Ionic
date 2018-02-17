angular.module('starter.seleccion-apuestas', ['ionic'])

    .controller('apuestasController', function ($scope, $cordovaSQLite, $state,
                                                $ionicPlatform, $ionicPopup, sql,
                                                $q, utils) {

        var apuestas = false;

        $scope.apuestas = [];

        $scope.seleccionParejas = function () {
            $state.go("seleccion_parejas");
        };

        $scope.seleccionarJuego = function () {
            seleccionarJuego()
        };

        $scope.seleccionarCampo = function () {

            var query = "SELECT seleccionado FROM campo WHERE seleccionado = (?) OR seleccionado = (?)";

            sql.sqlQuery(db,query, [1,2])
                .then(function (res) {
                    switch (res.rows.item(0).seleccionado){
                        case 1:
                            $state.go('tabs.camp-dis');
                            break;
                        case 2:
                            $state.go('tabs.camp-cue');
                            break;
                        default:
                            $state.go('tabs.camp-dis');
                            break
                    }

                }, function (err) {

                });
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

        function apuestasSeleccionadas() {
            var defered = $q.defer();
            var promise = defered.promise;

            var query = "SELECT id FROM apuesta WHERE seleccionada = 1";
            sql.sqlQuery(db, query, [])
                .then(function (res) {
                    if (res.rows.length > 0) {
                        apuestas = true;
                        defered.resolve("OK");
                    } else {
                        apuestas = false;
                        defered.resolve("OK");
                    }
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise
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

        function seleccionarJuego() {
            $q.when()
                .then(function () {
                    return apuestasSeleccionadas();
                })
                .then(function () {
                    if(apuestas){
                        $state.go('juego')
                    }else{
                        noSeleccionApuesta()
                    }
                })
                .catch(function (error) {
                    // utils.popup('Error', JSON.stringify(error));
                })
                .finally(function () {

                });
        }

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


        $ionicPlatform.ready(function () {
            getApuestas();
        });

    });
