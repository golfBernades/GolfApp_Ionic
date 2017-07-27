angular.module('starter.juego-foursome', ['ionic', 'starter.seleccion-jugadores'])

    .controller('juegoFoursomeController', function ($scope, $ionicPopup, $cordovaSQLite,
                                                     $state, $ionicLoading, $timeout,
                                                     $ionicPlatform, $q, $http,
                                                     serviceHttpRequest, $ionicPopover,
                                                     sql, $ionicSideMenuDelegate) {
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
                    return getLocalTablero();
                })
                .then(function () {
                    return cargarParejaIndex();
                })
                .then(function (index) {
                    return verFoursomePareja(index);
                })
                .then(function () {
                    return fixRowsAndColumns();
                })
                .then(function (res) {
                    $ionicLoading.hide();
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

        function verFoursomePareja(index) {
            var defered = $q.defer();
            var promise = defered.promise;

            var p1_j1_idx = $scope.tablero.apuestaFoursome[index].p1_j1.idx;
            var p1_j2_idx = $scope.tablero.apuestaFoursome[index].p1_j2.idx;
            var p2_j1_idx = $scope.tablero.apuestaFoursome[index].p2_j1.idx;
            var p2_j2_idx = $scope.tablero.apuestaFoursome[index].p2_j2.idx;

            console.log('GolfApp', 'Se renderizará el foursome de la pareja '
                + index);

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

            setTimeout(function () {
                defered.resolve('Pareja renderizada correctamente');
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
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'},
                    {width: 75, align: 'center'}
                ]
            });

            defered.resolve('OK');
            return promise;
        }
    });
