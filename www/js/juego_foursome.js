angular.module('starter.juego-foursome', ['ionic', 'starter.seleccion-jugadores'])

    .controller('juegoFoursomeController', function ($scope, $ionicPopup, $cordovaSQLite,
                                                     $state, $ionicLoading, $timeout,
                                                     $ionicPlatform, $q, $http,
                                                     serviceHttpRequest, $ionicPopover,
                                                     sql) {
        $scope.parejasDobles = false;

        $scope.hoyos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            16, 17, 18];

        $scope.tablero = {};

        $scope.tableroPareja = {};

        $scope.goJuegoGeneral = function () {
            $state.go('juego');
        };

        $scope.verFoursomePareja = function (index) {
            var query = 'UPDATE config_foursome SET pareja_idx=? ';

            sql.sqlQuery(db, query, [index])
                .then(function (res) {
                    $state.reload();
                })
                .catch(function (error) {
                    defered.reject(error);
                });
        };

        $ionicPlatform.ready(function () {
            showLoading();

            $q.when()
                .then(function () {
                    console.log('JuegoFoursome', 'Inicio Correcto');
                    return getLocalTablero();
                })
                .then(function () {
                    console.log('JuegoFoursome', 'getLocalTablero() Correcto');
                    return cargarParejaIndex();
                })
                .then(function (index) {
                    console.log('JuegoFoursome', 'cargarParejaIndex()' +
                        ' Correcto');
                    return verFoursomeCompeticion(index);
                })
                .then(function () {
                    console.log('JuegoFoursome', 'verFoursomeCompeticion()' +
                        ' Correcto');
                    return fixRowsAndColumns();
                })
                .then(function () {
                    console.log('JuegoFoursome', 'fixRowsAndColumns()' +
                        ' Correcto');
                    $ionicLoading.hide();
                    return $q.when();
                })
                .then(function () {
                    console.log('JuegoFoursome', 'All Correcto');
                })
                .catch(function (error) {
                    console.log('JuegoFoursome', error);
                });

            screen.orientation.addEventListener('change', function () {
                $state.reload();
            });
        });

        function cargarParejaIndex() {
            var defered = $q.defer();
            var promise = defered.promise;
            var query = 'SELECT pareja_idx FROM config_foursome';

            sql.sqlQuery(db, query, [])
                .then(function (res) {
                    if (res.rows.length > 0) {
                        defered.resolve(res.rows.item(0).pareja_idx);
                    } else {
                        defered.reject('No hay datos en config_foursome');
                    }
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        }

        function verFoursomeCompeticion(index) {
            var defered = $q.defer();
            var promise = defered.promise;

            if ($scope.parejasDobles) {
                verFoursomePareja(index)
                    .then(function () {
                        defered.resolve('VerFoursomePareja [OK]');
                    })
                    .catch(function (error) {
                        defered.reject(error);
                    });
            } else {
                verFoursomeIndividual(index)
                    .then(function () {
                        defered.resolve('verFoursomeIndividual [OK]');
                    })
                    .catch(function (error) {
                        defered.reject(error);
                    });
            }

            return promise;
        }

        function verFoursomeIndividual(index) {
            var defered = $q.defer();
            var promise = defered.promise;

            console.log('verFoursomeIndividual(' + index + ')',
                $scope.tablero.apuestaFoursome[index]);

            var j1_idx = $scope.tablero.apuestaFoursome[index].j1.idx;
            var j2_idx = $scope.tablero.apuestaFoursome[index].j2.idx;

            $scope.tableroPareja.datos_juego = [
                {
                    nombre: $scope.tablero.datos_juego[j1_idx].nombre,
                    handicap: $scope.tablero.datos_juego[j1_idx].handicap,
                    golpes: $scope.tablero.datos_juego[j1_idx].golpes,
                    circulos: $scope.tablero.datos_juego[j1_idx].circulos
                },
                {
                    nombre: $scope.tablero.datos_juego[j2_idx].nombre,
                    handicap: $scope.tablero.datos_juego[j2_idx].handicap,
                    golpes: $scope.tablero.datos_juego[j2_idx].golpes,
                    circulos: $scope.tablero.datos_juego[j2_idx].circulos
                }
            ];

            $scope.tableroPareja.puntosFoursome
                = $scope.tablero.apuestaFoursome[index].p1_puntos;

            setTimeout(function () {
                defered.resolve('Competición renderizada correctamente');
            }, 300);

            return promise;
        }

        function verFoursomePareja(index) {
            var defered = $q.defer();
            var promise = defered.promise;

            var p1_j1_idx = $scope.tablero.apuestaFoursome[index].p1_j1.idx;
            var p1_j2_idx = $scope.tablero.apuestaFoursome[index].p1_j2.idx;
            var p2_j1_idx = $scope.tablero.apuestaFoursome[index].p2_j1.idx;
            var p2_j2_idx = $scope.tablero.apuestaFoursome[index].p2_j2.idx;

            $scope.tableroPareja.datos_juego = [
                {
                    nombre: $scope.tablero.datos_juego[p1_j1_idx].nombre,
                    handicap: $scope.tablero.datos_juego[p1_j1_idx].handicap,
                    golpes: $scope.tablero.datos_juego[p1_j1_idx].golpes,
                    circulos: $scope.tablero.datos_juego[p1_j1_idx].circulos
                },
                {
                    nombre: $scope.tablero.datos_juego[p1_j2_idx].nombre,
                    handicap: $scope.tablero.datos_juego[p1_j2_idx].handicap,
                    golpes: $scope.tablero.datos_juego[p1_j2_idx].golpes,
                    circulos: $scope.tablero.datos_juego[p1_j2_idx].circulos
                },
                {
                    nombre: $scope.tablero.datos_juego[p2_j1_idx].nombre,
                    handicap: $scope.tablero.datos_juego[p2_j1_idx].handicap,
                    golpes: $scope.tablero.datos_juego[p2_j1_idx].golpes,
                    circulos: $scope.tablero.datos_juego[p2_j1_idx].circulos
                },
                {
                    nombre: $scope.tablero.datos_juego[p2_j2_idx].nombre,
                    handicap: $scope.tablero.datos_juego[p2_j2_idx].handicap,
                    golpes: $scope.tablero.datos_juego[p2_j2_idx].golpes,
                    circulos: $scope.tablero.datos_juego[p2_j2_idx].circulos
                }
            ];

            $scope.tableroPareja.puntosFoursome
                = $scope.tablero.apuestaFoursome[index].p1_puntos;

            setTimeout(function () {
                defered.resolve('Competición renderizada correctamente');
            }, 300);

            return promise;
        }

        function getLocalTablero() {
            var defered = $q.defer();
            var promise = defered.promise;
            var query = 'SELECT * FROM tablero_json';

            sql.sqlQuery(db, query, [])
                .then(function (res) {
                    if (res.rows.length > 0) {
                        $scope.tablero = JSON.parse(res.rows.item(0).tablero);
                        $scope.parejasDobles = $scope.tablero.configFoursome
                                .modoJugadores == 'pareja';
                        defered.resolve(res);
                    } else {
                        defered.reject('No hay tablero foursome local');
                    }
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        }

        function showLoading() {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>' +
                '<p>Cargando</p>',
                animation: 'fade-in'
            });
        }

        function fixRowsAndColumns() {
            var defered = $q.defer();
            var promise = defered.promise;

            $('#table_foursome').fxdHdrCol({
                fixedCols: 1,
                width: '100%',
                height: '100%',
                colModal: [
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'},
                    {width: 60, align: 'center'}
                ]
            });

            defered.resolve('OK');
            return promise;
        }
    });
