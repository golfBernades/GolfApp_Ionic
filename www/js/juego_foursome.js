angular.module('starter.juego-foursome', ['ionic', 'starter.seleccion-jugadores'])

    .controller('juegoFoursomeController', function ($scope, $cordovaSQLite,
                                                     $state, $timeout,
                                                     $ionicPlatform, $q, $http,
                                                     serviceHttpRequest,
                                                     $ionicPopover, utils) {

            ////////////////////////////////////////////////////////////////////
            $scope.parejas = [];
            $scope.parejasDobles = false;
            ////////////////////////////////////////////////////////////////////

            $scope.hoyos1a9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            $scope.hoyos10a18 = [10, 11, 12, 13, 14, 15, 16, 17, 18];
            $scope.pares1a9 = [];
            $scope.pares10a18 = [];
            $scope.ventajas1a9 = [];
            $scope.ventajas10a18 = [];
            $scope.nombreCampo = '';

            $scope.jugadores = [];
            $scope.jugadores = [];
            $scope.tablero = {};
            $scope.campo = {};
            $scope.partido = {};

            var opcionesPopover;
            var sCirc = 'div-circular';
            var nCirc = 'circular-hidden';
            var modulePromises = [];

            function fixRowsAndColumns() {
                $('#fixed_table').fxdHdrCol({
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
            }

            function loadJugadores() {
                var queryJugadores = "SELECT * FROM jugador WHERE jugar = 1 ORDER BY handicap, nombre ASC";

                var selectJugadoresPromise = $cordovaSQLite
                    .execute(db, queryJugadores).then(function (resJug) {
                        $scope.tablero.datos_juego = [];

                        for (var i = 0; i < resJug.rows.length; i++) {
                            $scope.jugadores.push(resJug.rows.item(i));

                            $scope.tablero.datos_juego.push({
                                index: i,
                                nombre: resJug.rows.item(i).nombre,
                                handicap: resJug.rows.item(i).handicap,
                                jugador_id: resJug.rows.item(i).id,
                                golpes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0],
                                totales_golpes: [0, 0, 0],
                                circulos: [
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc]
                                ]
                            });
                        }
                    });
                modulePromises.push(selectJugadoresPromise);
            }

            function loadCampo() {
                var queryCampo = "SELECT * FROM campo WHERE seleccionado = 1";

                var selectCampoPromise = $cordovaSQLite.execute(db, queryCampo)
                    .then(function (res) {
                        if (res.rows.length > 0) {
                            $scope.tablero.campo = {
                                nombre: res.rows.item(0).nombre,
                                pares1a9: [
                                    {value: res.rows.item(0).par_hoyo_1},
                                    {value: res.rows.item(0).par_hoyo_2},
                                    {value: res.rows.item(0).par_hoyo_3},
                                    {value: res.rows.item(0).par_hoyo_4},
                                    {value: res.rows.item(0).par_hoyo_5},
                                    {value: res.rows.item(0).par_hoyo_6},
                                    {value: res.rows.item(0).par_hoyo_7},
                                    {value: res.rows.item(0).par_hoyo_8},
                                    {value: res.rows.item(0).par_hoyo_9}
                                ],
                                pares10a18: [
                                    {value: res.rows.item(0).par_hoyo_10},
                                    {value: res.rows.item(0).par_hoyo_11},
                                    {value: res.rows.item(0).par_hoyo_12},
                                    {value: res.rows.item(0).par_hoyo_13},
                                    {value: res.rows.item(0).par_hoyo_14},
                                    {value: res.rows.item(0).par_hoyo_15},
                                    {value: res.rows.item(0).par_hoyo_16},
                                    {value: res.rows.item(0).par_hoyo_17},
                                    {value: res.rows.item(0).par_hoyo_18}
                                ],
                                pares: [],
                                ventajas1a9: [
                                    {value: res.rows.item(0).ventaja_hoyo_1},
                                    {value: res.rows.item(0).ventaja_hoyo_2},
                                    {value: res.rows.item(0).ventaja_hoyo_3},
                                    {value: res.rows.item(0).ventaja_hoyo_4},
                                    {value: res.rows.item(0).ventaja_hoyo_5},
                                    {value: res.rows.item(0).ventaja_hoyo_6},
                                    {value: res.rows.item(0).ventaja_hoyo_7},
                                    {value: res.rows.item(0).ventaja_hoyo_8},
                                    {value: res.rows.item(0).ventaja_hoyo_9}
                                ],
                                ventajas10a18: [
                                    {value: res.rows.item(0).ventaja_hoyo_10},
                                    {value: res.rows.item(0).ventaja_hoyo_11},
                                    {value: res.rows.item(0).ventaja_hoyo_12},
                                    {value: res.rows.item(0).ventaja_hoyo_13},
                                    {value: res.rows.item(0).ventaja_hoyo_14},
                                    {value: res.rows.item(0).ventaja_hoyo_15},
                                    {value: res.rows.item(0).ventaja_hoyo_16},
                                    {value: res.rows.item(0).ventaja_hoyo_17},
                                    {value: res.rows.item(0).ventaja_hoyo_18}
                                ],
                                ventajas: []
                            };

                            $scope.tablero.campo.pares =
                                $scope.tablero.campo.pares1a9
                                    .concat($scope.tablero.campo.pares10a18);

                            $scope.tablero.campo.ventajas =
                                $scope.tablero.campo.ventajas1a9
                                    .concat($scope.tablero.campo.ventajas10a18);

                            var crearCampo = function () {
                                $scope.campo = new Campo(res.rows.item(0).id,
                                    $scope.tablero.campo.nombre,
                                    $scope.tablero.campo.pares,
                                    $scope.tablero.campo.ventajas);
                            };

                            modulePromises.push(crearCampo());
                        }
                    });
                modulePromises.push(selectCampoPromise);
            }

            $scope.selectJuego = function () {
                $state.go('juego')
            };

            $scope.showOpcionesPartido = function ($event) {
                opcionesPopover.show($event);
            };

            $ionicPlatform.ready(function () {
                // console.log('GolfApp', 'juego.$ionicPlatform.ready()');

                utils.showLoading();

                modulePromises.push(loadCampo());
                modulePromises.push(loadJugadores());

                $q.all(modulePromises).then(function () {
                    $scope.partido = new Partido($scope.jugadores, $scope.campo);


                    setTimeout(function () {
                        fixRowsAndColumns();

                        setTimeout(function () {
                            utils.hideLoading();
                        }, 500);
                    }, 500)

                });

                $ionicPopover.fromTemplateUrl(
                    'templates/opciones_partido_popover.html', {
                        scope: $scope
                    }).then(function (popover) {
                    opcionesPopover = popover;
                });

                screen.orientation.addEventListener('change', function () {
                    $state.reload();
                });
            });

        }
    )
;
