angular.module('starter.juego_consulta', ['ionic'])

    .controller('juegoConsultaController', function ($scope, $ionicPopup, $cordovaSQLite,
                                                     $state, $ionicLoading, $timeout,
                                                     $ionicPlatform, $q, $http, $ionicPopover,
                                                     serviceHttpRequest, utils, sql) {
        var modulePromises = [];
        var opcionesPopover;

        $scope.partidoExistente={
            claveConsulta:""
        };

        $scope.hoyos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        $scope.hoyos1a9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        $scope.hoyos10a18 = [10, 11, 12, 13, 14, 15, 16, 17, 18];
        $scope.foursomeSeleccionada = false;

        $scope.solo_vista = true;

        $ionicPlatform.ready(function () {
            // console.log('GolfApp>> juego.$ionicPlatform.ready');

            getClave();

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

        $scope.seleccionarInicio = function () {
            $state.go('inicio');
        };

        $scope.actualizarJuego = function () {
            getMarcador();
            // $state.reload();
        };

        $scope.showOpcionesPartido = function ($event) {
            opcionesPopover.show($event);
        };

        $scope.finalizarPartido = function() {
            deleteClave();
        };

        $scope.selectFoursome = function () {
            var query = "UPDATE consulta_json SET clave = ?";
            sql.sqlQuery(db, query, [1])
                .then(function (res) {
                    actualizarFoursomePareja(0)
                })
                .catch(function (error) {
                    console.log(JSON.stringify(error))
                });
        };

        function actualizarFoursomePareja(index) {
            var query = 'UPDATE config_foursome SET pareja_idx=? ';
            sql.sqlQuery(db, query, [index])
                .then(function (res) {
                    opcionesPopover.hide();
                    $state.go('juego_foursome');
                })
                .catch(function (error) {
                    console.log(JSON.stringify(error));
                });
        };

        function getMarcador() {
            utils.showLoading();

            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir + 'partido_tablero_get', {
                    clave_consulta: $scope.partidoExistente.claveConsulta
                }
            );

            var getTableroPromise = $http(httpRequest)
                .then(function successCallback(response) {
                    if (response.data.ok) {
                        $scope.tablero = response.data.tablero;
                        $scope.foursomeSeleccionada = response.data.tablero.foursomeSeleccionada;

                        setTimeout(function () {
                            fixRowsAndColumns();
                            calcularPosiciones();
                        }, 1000);
                    } else {
                        noActualizacionesCampo();
                    }
                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                }, function errorCallback(response) {
                    /*
                    utils.popup('Error', JSON.stringify(response));
                    if (response.status == -1) {
                        utils.popup('Error', 'Error de conexión');
                    } else {
                        utils.popup('Error', response.data.error_message);
                    }
                    */
                    errorLoadingTablero()
                });

            modulePromises.push(getTableroPromise);
        }

        function noActualizacionesCampo() {
            $ionicLoading.hide();
            var confirmPopup = $ionicPopup.confirm({
                title: 'Error al cargar el Tablero',
                template: 'Aún no hay actualizaciones disponibles,' +
                    ' intenta más tarde',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    $state.reload();
                } else {
                    deleteClave();
                }
            });
        }

        function errorLoadingTablero() {
            $ionicLoading.hide();
            var confirmPopup = $ionicPopup.confirm({
                title: 'Error al cargar el Tablero',
                template: '¿Deseas volver a reintentar cargar el Tablero?',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    $state.reload();
                } else {
                    $state.go('inicio')
                }
            });
        }

        function fixRowsAndColumns() {
            $('#table_juego_consulta').fxdHdrCol({
                fixedCols: 1,
                width: '100%',
                height: '100%',
                colModal: [
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'}
                ]
            });
        }

        function getClave() {
            var query = "SELECT * FROM clave";
            $cordovaSQLite.execute(db, query)
                .then(function (res) {
                    $scope.partidoExistente.claveConsulta = res.rows.item(0).clave;
                    getMarcador();
                }, function (err) {
                    // console.log(JSON.stringify(err))
                });
        }

        function deleteClave() {
            var query = "DELETE FROM clave";
            $cordovaSQLite.execute(db, query)
                .then(function (res) {
                    opcionesPopover.hide();
                    $state.go('inicio')
                }, function (err) {
                    // console.log(JSON.stringify(err))
                });
        }

        function compare(a, b) {
            if (a.golpes < b.golpes)
                return -1;
            if (a.golpes > b.golpes)
                return 1;
            return 0;
        }

        function ordinal_suffix_of(i) {
            var j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st";
            }
            if (j == 2 && k != 12) {
                return i + "nd";
            }
            if (j == 3 && k != 13) {
                return i + "rd";
            }
            return i + "th";
        }

        function calcularPosiciones() {
            var array = [];
            for (var i = 0; i < $scope.tablero.datos_juego.length; i++) {

                if ($scope.tablero.datos_juego[i].nombre.toLowerCase() != "mudo") {
                    array.push({
                        idx: $scope.tablero.datos_juego[i].index,
                        golpes: $scope.tablero.datos_juego[i].totales_golpes[3]
                    })
                }
            }

            array = array.sort(compare)
            var posiciones = 1;
            var ordinalNumber=0;

            $scope.tablero.datos_juego[array[0].idx].lugar = ordinal_suffix_of(posiciones);

            for(var i=1; i<array.length;i++){
                if(array[i].golpes != array[i-1].golpes){
                    posiciones = i+1
                }
                ordinalNumber = ordinal_suffix_of(posiciones);
                $scope.tablero.datos_juego[array[i].idx].lugar =  ordinalNumber;

            }
        }

    });
