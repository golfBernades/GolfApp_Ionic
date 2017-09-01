/**
 * Created by Victor Hugo on 22/03/2017.
 */
angular.module('starter.seleccion-parejas', ['ionic'])

    .controller('parejasController', function ($scope, $ionicPopup,
                                               $cordovaSQLite, $state,
                                               $ionicPlatform, $q, utils, sql) {
        var jugadoresList = [];

        $scope.ejemplo = "Holaa Mundo"
        $scope.listJN1 = [];
        $scope.listJN2 = [];
        $scope.listJN3 = [];
        $scope.listJN4 = [];
        $scope.listJN5 = [];
        $scope.listJN6 = [];

        $scope.handicapIgual = false;
        $scope.handicapIgualDos = false;
        $scope.dosJugadores = true;
        $scope.pareja_individual = false;
        $scope.pareja_doble = true;

        $scope.listaUno = {
            opcion: ""
        };

        $scope.listaDos = {
            opcion: ""
        };

        $scope.listaTres = {
            opcion: ""
        };

        $scope.listaCuatro = {
            opcion: ""
        };

        $scope.listaCinco = {
            opcion: ""
        };

        $scope.listaSeis = {
            opcion: ""
        };

        $scope.listaSeis = {
            opcion: ""
        };

        $scope.jugadoresLista = {
            opcion: ""
        };

        $scope.presionesLista = {
            opcion: ""
        };
        $scope.parejas = [];
        $scope.parejasIndividual = [];

        var j_1;
        var j_2;
        var j_3;
        var j_4;
        var j_5;
        var j_6;

        var alertPopupOpcionesCampo;
        var index;
        var idPareja;
        var contParejas = 0;
        var isCrearPareja = false;
        var flagParejas = true;


        var indexJug = {
            jug_1: 0,
            jug_2: 0,
            jug_3: 0,
            jug_4: 0
        };

        var ventaja = {
            p_1: 0,
            p_2: 0
        };

        var mudo = {
            id: 9999,
            nombre: "Mudo",
            handicap: 0,
            jugar: true
        };

        $scope.jugList = [
            "1 VS 1",
            "2 VS 2"
        ];

        $scope.preList = [
            "2 Golpes",
            "3 Golpes"
        ];

        var lengthParejas = {
            doble: 0,
            individual: 0
        }

        $scope.comenzarJuego = function () {

            if ($scope.parejas.length > 0 || $scope.parejasIndividual.length > 0) {
                configFoursome();
            } else {
                utils.popup('Parejas', 'Para poder avanzar debes haber formado minimo 1 pareja');
            }
        };

        $scope.seleccionarApuesta = function () {
            $state.go("seleccion_apuestas")
        };

        $scope.addParejas = function () {
            isCrearPareja = true;
            alertCrearParejas('crear_parejas_popup.html', 'Crear');
        };

        function configFoursome() {
            var dataQuery = [];

            switch ($scope.jugadoresLista.opcion) {
                case "1 VS 1":
                    dataQuery[0] = 'individual';
                    break;
                case "2 VS 2":
                    dataQuery[0] = 'pareja';
                    break;
            }

            switch ($scope.presionesLista.opcion) {
                case "2 Golpes":
                    dataQuery[1] = 'normal';
                    break;
                case "3 Golpes":
                    dataQuery[1] = 'california';
                    break;
            }

            var query = "UPDATE config_foursome SET modo_jugadores = ?, " +
                "modo_presiones = ?, pareja_idx=0";

            $cordovaSQLite.execute(db, query, [dataQuery[0], dataQuery[1]])
                .then(function () {
                    $state.go('juego');
                }, function (err) {
                    console.log(JSON.stringify(err))
                });
        }

        function parejasDobles(e) {
            var parejaExistente = parejaExistenteDoble($scope.listaUno.opcion, $scope.listaDos.opcion, $scope.listaTres.opcion, $scope.listaCuatro.opcion);

            if (!isCrearPareja && !parejaExistente) {
                alertPopupOpcionesCampo.close();
            } else {
                if (parejaExistente) {
                    if (validarParejas()) {
                        if ($scope.handicapIgual) {
                            if ($scope.listaCinco.opcion.id == null) {
                                utils.popup("Seleccionar Jugador",
                                    "Seleccionar jugador con preferencia en " +
                                    "Handicap para la pareja 1.");
                                e.preventDefault();
                                return;
                            } else {
                                ventaja.p_1 = handicapMayor($scope.listaUno.opcion,
                                    $scope.listaDos.opcion, 1);
                            }
                        } else {
                            ventaja.p_1 = handicapMayor($scope.listaUno.opcion,
                                $scope.listaDos.opcion, 1);
                        }

                        if ($scope.handicapIgualDos) {
                            if ($scope.listaSeis.opcion.id == null) {
                                utils.popup("Seleccionar Jugador", "Seleccionar " +
                                    "jugador con preferencia en Handicap para la " +
                                    "pareja 2.");
                                e.preventDefault();
                                return;
                            } else {
                                ventaja.p_2 = handicapMayor($scope.listaTres.opcion,
                                    $scope.listaCuatro.opcion, 2);
                            }
                        } else {
                            ventaja.p_2 = handicapMayor($scope.listaTres.opcion,
                                $scope.listaCuatro.opcion, 2);
                        }

                        if (isCrearPareja) {
                            insertarPareja();
                        } else {
                            actualizarParejas();
                        }
                    } else {
                        utils.popup("Pareja Invalida", "Para poder avanzar " +
                            "formar una pareja valida, no repetir dos veces, " +
                            "los dos jugadores.");
                        e.preventDefault();
                    }
                } else {
                    utils.popup("Pareja Repetida", "Para poder avanzar formar " +
                        "una pareja no existente.");
                    e.preventDefault();
                }
            }
        }

        function actualizarParejas() {
            var querey = 'UPDATE foursome SET '
                + 'p1_j1_id = ?, p1_j1_nombre = ?, p1_j1_handicap = ?, p1_j1_idx = ?,'
                + 'p1_j2_id = ?, p1_j2_nombre = ?, p1_j2_handicap = ?, p1_j2_idx = ?, p1_jug_ventaja = ?, '
                + 'p2_j1_id = ?, p2_j1_nombre = ?, p2_j1_handicap = ?, p2_j1_idx = ?,'
                + 'p2_j2_id = ?, p2_j2_nombre = ?, p2_j2_handicap = ?, p2_j2_idx = ?, p2_jug_ventaja = ? '
                + 'WHERE id = ?';

            var queryData = [$scope.listaUno.opcion.id,
                $scope.listaUno.opcion.nombre,
                $scope.listaUno.opcion.handicap, indexJug.jug_1,
                $scope.listaDos.opcion.id, $scope.listaDos.opcion.nombre,
                $scope.listaDos.opcion.handicap, indexJug.jug_2, ventaja.p_1,
                $scope.listaTres.opcion.id, $scope.listaTres.opcion.nombre,
                $scope.listaTres.opcion.handicap, indexJug.jug_3,
                $scope.listaCuatro.opcion.id, $scope.listaCuatro.opcion.nombre,
                $scope.listaCuatro.opcion.handicap, indexJug.jug_4, ventaja.p_2,
                idPareja];


            sql.sqlQuery(db, querey, queryData)
                .then(function (res) {
                    $scope.parejas[index].p1_j1_id = $scope.listaUno.opcion.id;
                    $scope.parejas[index].p1_j1_nombre = $scope.listaUno.opcion.nombre;
                    $scope.parejas[index].p1_j1_handicap = $scope.listaUno.opcion.handicap;
                    $scope.parejas[index].p1_j1_idx = indexJug.jug_1;
                    $scope.parejas[index].p1_j2_id = $scope.listaDos.opcion.id;
                    $scope.parejas[index].p1_j2_nombre = $scope.listaDos.opcion.nombre;
                    $scope.parejas[index].p1_j2_handicap = $scope.listaDos.opcion.handicap;
                    $scope.parejas[index].p1_j2_idx = indexJug.jug_2;
                    $scope.parejas[index].p1_jug_ventaja = ventaja.p_1;
                    $scope.parejas[index].p2_j1_id = $scope.listaTres.opcion.id;
                    $scope.parejas[index].p2_j1_nombre = $scope.listaTres.opcion.nombre;
                    $scope.parejas[index].p2_j1_handicap = $scope.listaTres.opcion.handicap;
                    $scope.parejas[index].p2_j1_idx = indexJug.jug_3;
                    $scope.parejas[index].p2_j2_id = $scope.listaCuatro.opcion.id;
                    $scope.parejas[index].p2_j2_nombre = $scope.listaCuatro.opcion.nombre;
                    $scope.parejas[index].p2_j2_handicap = $scope.listaCuatro.opcion.handicap;
                    $scope.parejas[index].p2_j2_idx = indexJug.jug_4;
                    $scope.parejas[index].p2_jug_ventaja = ventaja.p_2;
                    alertPopupOpcionesCampo.close();
                })
                .catch(function (error) {

                });
        }

        function insertarPareja() {
            var insertQuery = 'INSERT INTO foursome('
                + 'p1_j1_id, p1_j1_nombre, p1_j1_handicap, p1_j1_idx,'
                + 'p1_j2_id, p1_j2_nombre, p1_j2_handicap, p1_j2_idx, p1_jug_ventaja,'
                + 'p2_j1_id, p2_j1_nombre, p2_j1_handicap, p2_j1_idx,'
                + 'p2_j2_id, p2_j2_nombre, p2_j2_handicap, p2_j2_idx, p2_jug_ventaja) '
                + 'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

            var queryData = [
                $scope.listaUno.opcion.id,
                $scope.listaUno.opcion.nombre,
                $scope.listaUno.opcion.handicap,
                indexJug.jug_1,
                $scope.listaDos.opcion.id,
                $scope.listaDos.opcion.nombre,
                $scope.listaDos.opcion.handicap,
                indexJug.jug_2,
                ventaja.p_1,
                $scope.listaTres.opcion.id,
                $scope.listaTres.opcion.nombre,
                $scope.listaTres.opcion.handicap,
                indexJug.jug_3,
                $scope.listaCuatro.opcion.id,
                $scope.listaCuatro.opcion.nombre,
                $scope.listaCuatro.opcion.handicap,
                indexJug.jug_4,
                ventaja.p_2];

            $cordovaSQLite.execute(db, insertQuery, queryData)
                .then(function (res) {
                    $scope.parejas.push({
                        id: res.insertId,
                        p1_j1_id: $scope.listaUno.opcion.id,
                        p1_j1_nombre: $scope.listaUno.opcion.nombre,
                        p1_j1_handicap: $scope.listaUno.opcion.handicap,
                        p1_j1_idx: indexJug.jug_1,
                        p1_j2_id: $scope.listaDos.opcion.id,
                        p1_j2_nombre: $scope.listaDos.opcion.nombre,
                        p1_j2_handicap: $scope.listaDos.opcion.handicap,
                        p1_j2_idx: indexJug.jug_2,
                        p1_jug_ventaja: ventaja.p_1,
                        p2_j1_id: $scope.listaTres.opcion.id,
                        p2_j1_nombre: $scope.listaTres.opcion.nombre,
                        p2_j1_handicap: $scope.listaTres.opcion.handicap,
                        p2_j1_idx: indexJug.jug_3,
                        p2_j2_id: $scope.listaCuatro.opcion.id,
                        p2_j2_nombre: $scope.listaCuatro.opcion.nombre,
                        p2_j2_handicap: $scope.listaCuatro.opcion.handicap,
                        p2_j2_idx: indexJug.jug_4,
                        p2_jug_ventaja: ventaja.p_2
                    });
                }, function (err) {
                    console.log(JSON.stringify(err))
                });
        }

        function parejaIndividual(e) {
            if (parejaExistenteIndividual($scope.listaDos.opcion, $scope.listaTres.opcion)) {
                var insertQuery = 'INSERT INTO foursome('
                    + 'p1_j1_id, p1_j1_nombre, p1_j1_handicap, p1_j1_idx,'
                    + 'p1_j2_id, p1_j2_nombre, p1_j2_handicap, p1_j2_idx)'
                    + 'VALUES (?,?,?,?,?,?,?,?)';

                var queryData = [$scope.listaDos.opcion.id, $scope.listaDos.opcion.nombre, $scope.listaDos.opcion.handicap, indexJug.jug_2,
                    $scope.listaTres.opcion.id, $scope.listaTres.opcion.nombre, $scope.listaTres.opcion.handicap, indexJug.jug_3];


                $cordovaSQLite.execute(db, insertQuery, queryData)
                    .then(function (res) {
                        $scope.parejasIndividual.push({
                            id: res.insertId,
                            p1_j1_id: $scope.listaDos.opcion.id,
                            p1_j1_nombre: $scope.listaDos.opcion.nombre,
                            p1_j1_handicap: $scope.listaDos.opcion.handicap,
                            p1_j2_id: $scope.listaTres.opcion.id,
                            p1_j2_nombre: $scope.listaTres.opcion.nombre,
                            p1_j2_handicap: $scope.listaTres.opcion.handicap
                        });
                    }, function (err) {
                        console.log(JSON.stringify(err))
                    });
            } else {
                utils.popup("Pareja Repetida",
                    "Para poder avanzar formar una pareja no existente.");
                e.preventDefault();
            }
        }

        function handicapMayor(jug_1, jug_2, par) {
            if (jug_1.handicap > jug_2.handicap) {
                console.log('Pareja [' + par + '] -> Ventaja para jugador 1');
                return 1
            } else if (jug_1.handicap < jug_2.handicap) {
                console.log('Pareja [' + par + '] -> Ventaja para jugador 2');
                return 2;
            } else {
                if (par == 1) {
                    if ($scope.listaCinco.opcion.id == jug_1.id) {
                        console.log('Pareja [' + par + '] -> Ventaja para jugador 1');
                        return 1;
                    } else {
                        console.log('Pareja [' + par + '] -> Ventaja para jugador 2');
                        return 2;
                    }
                } else {
                    if ($scope.listaSeis.opcion.id == jug_1.id) {
                        console.log('Pareja [' + par + '] -> Ventaja para jugador 1');
                        return 1;
                    } else {
                        console.log('Pareja [' + par + '] -> Ventaja para jugador 2');
                        return 2;
                    }
                }
            }
        }

        function agregarJugadoresSelect(jugador, list) {
            for (var i = 0; i < jugadoresList.length; i++) {
                list.pop();
            }

            for (var i = 0; i < jugadoresList.length; i++) {
                if (jugador.id != jugadoresList[i].id) {
                    list.push(jugadoresList[i]);
                }
            }
        }

        function buscadorIndex(jugador) {

            for (var i = 0; i < jugadoresList.length; i++) {
                if (jugador.id == jugadoresList[i].id) {
                    return i;
                    break;
                }
            }
        }

        function handicapIgual(jug_1, jug_2, list, pareja) {

            for (var i = 0; i < 2; i++) {
                list.pop()
            }
            if (jug_2 != null) {
                if (jug_1.handicap == jug_2.handicap) {

                    list.push(jug_1);
                    list.push(jug_2);

                    if (pareja == 1) {
                        $scope.handicapIgual = true;
                    } else {
                        $scope.handicapIgualDos = true;
                    }
                } else {
                    if (pareja == 1) {
                        $scope.handicapIgual = false;
                    } else {
                        $scope.handicapIgualDos = false;
                    }
                }
            }
        }

        function parejaExistenteDoble(jug_1, jug_2, jug_3, jug_4) {

            flagParejas = true;

            for (var i = 0; i < $scope.parejas.length; i++) {


                if (($scope.parejas[i].p1_j1_id == jug_1.id) && ($scope.parejas[i].p1_j2_id == jug_2.id) && ($scope.parejas[i].p2_j1_id == jug_3.id) && ($scope.parejas[i].p2_j2_id == jug_4.id)) {
                    flagParejas = false;
                    break;
                }

                if (($scope.parejas[i].p1_j1_id == jug_2.id) && ($scope.parejas[i].p1_j2_id == jug_1.id) && ($scope.parejas[i].p2_j1_id == jug_3.id) && ($scope.parejas[i].p2_j2_id == jug_4.id)) {
                    flagParejas = false;
                    break;
                }

                if (($scope.parejas[i].p1_j1_id == jug_1.id) && ($scope.parejas[i].p1_j2_id == jug_2.id) && ($scope.parejas[i].p2_j1_id == jug_4.id) && ($scope.parejas[i].p2_j2_id == jug_3.id)) {
                    flagParejas = false;
                    break;
                }

                if (($scope.parejas[i].p1_j1_id == jug_2.id) && ($scope.parejas[i].p1_j2_id == jug_1.id) && ($scope.parejas[i].p2_j1_id == jug_4.id) && ($scope.parejas[i].p2_j2_id == jug_3.id)) {
                    flagParejas = false;
                    break;
                }

                //

                if (($scope.parejas[i].p1_j1_id == jug_3.id) && ($scope.parejas[i].p1_j2_id == jug_4.id) && ($scope.parejas[i].p2_j1_id == jug_1.id) && ($scope.parejas[i].p2_j2_id == jug_2.id)) {
                    flagParejas = false;
                    break;
                }

                if (($scope.parejas[i].p1_j1_id == jug_4.id) && ($scope.parejas[i].p1_j2_id == jug_3.id) && ($scope.parejas[i].p2_j1_id == jug_2.id) && ($scope.parejas[i].p2_j2_id == jug_1.id)) {
                    flagParejas = false;
                    break;
                }

                if (($scope.parejas[i].p1_j1_id == jug_3.id) && ($scope.parejas[i].p1_j2_id == jug_4.id) && ($scope.parejas[i].p2_j1_id == jug_1.id) && ($scope.parejas[i].p2_j2_id == jug_2.id)) {
                    flagParejas = false;
                    break;
                }

                if (($scope.parejas[i].p1_j1_id == jug_4.id) && ($scope.parejas[i].p1_j2_id == jug_3.id) && ($scope.parejas[i].p2_j1_id == jug_2.id) && ($scope.parejas[i].p2_j2_id == jug_1.id)) {
                    flagParejas = false;
                    break;
                }

            }
            return flagParejas
        }

        function parejaExistenteIndividual(jug_1, jug_2) {

            var temp = true;

            for (var i = 0; i < $scope.parejasIndividual.length; i++) {
                if (jug_1.id == $scope.parejasIndividual[i].p1_j1_id && jug_2.id == $scope.parejasIndividual[i].p1_j2_id) {
                    temp = false;

                    break;
                }
                if (jug_1.id == $scope.parejasIndividual[i].p1_j2_id && jug_2.id == $scope.parejasIndividual[i].p1_j1_id) {
                    temp = false;

                    break;
                }
            }


            return temp;
        }

        function validarParejas() {

            var temp = true;

            if ($scope.listaUno.opcion.id == $scope.listaTres.opcion.id && $scope.listaDos.opcion.id == $scope.listaTres.opcion.id) {
                temp = false;
            } else if ($scope.listaUno.opcion.id == $scope.listaCuatro.opcion.id && $scope.listaDos.opcion.id == $scope.listaCuatro.opcion.id) {
                temp = false;
            }

            return temp;
        }

        $scope.popupOpcionesParejas = function (idp, idx) {
            index = idx;
            idPareja = idp;
            alertOpcionesCampo("edit_delete_campo.html");
        };

        $scope.selectedListaUno = function () {
            agregarJugadoresSelect($scope.listaUno.opcion, $scope.listJN2);
            indexJug.jug_1 = buscadorIndex($scope.listaUno.opcion);
            handicapIgual($scope.listaUno.opcion, $scope.listaDos.opcion, $scope.listJN5, 1);
        };

        $scope.selectedListaDos = function () {

            if ($scope.dosJugadores) {
                agregarJugadoresSelect($scope.listaDos.opcion, $scope.listJN1);
                indexJug.jug_2 = buscadorIndex($scope.listaDos.opcion);
                handicapIgual($scope.listaDos.opcion, $scope.listaUno.opcion, $scope.listJN5, 1);
            } else {
                agregarJugadoresSelect($scope.listaDos.opcion, $scope.listJN3);
                indexJug.jug_2 = buscadorIndex($scope.listaDos.opcion);
            }
        };

        $scope.selectedListaTres = function () {

            console.log("lista 3")
            if ($scope.dosJugadores) {
                console.log("trueee")

                agregarJugadoresSelect($scope.listaTres.opcion, $scope.listJN4);
                indexJug.jug_3 = buscadorIndex($scope.listaTres.opcion);
                handicapIgual($scope.listaTres.opcion, $scope.listaCuatro.opcion, $scope.listJN6, 2);
            } else {
                console.log("falseeee")

                agregarJugadoresSelect($scope.listaTres.opcion, $scope.listJN2);
                indexJug.jug_3 = buscadorIndex($scope.listaTres.opcion)
            }
        };

        $scope.selectedListaCuatro = function () {
            agregarJugadoresSelect($scope.listaCuatro.opcion, $scope.listJN3);
            indexJug.jug_4 = buscadorIndex($scope.listaCuatro.opcion);
            handicapIgual($scope.listaCuatro.opcion, $scope.listaTres.opcion, $scope.listJN6, 2);
        };

        $scope.selectedListaCinco = function () {
            j_5 = $scope.listaCinco.opcion;
        };

        $scope.selectedListaSeis = function () {
            j_6 = $scope.listaSeis.opcion;

        };

        $scope.selectedJugadoresLista = function () {
            console.log("VERSUS: " + $scope.jugadoresLista.opcion);

            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmación',
                template: '¿Seguro que desea cambiar a la modalidad a ' + $scope.jugadoresLista.opcion + '? Esto eliminará las parejas que hayas formado.'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    eliminarParejas();
                } else {
                    if ($scope.jugadoresLista.opcion == "1 VS 1") {
                        $scope.jugadoresLista.opcion = $scope.jugList[1];
                        anadirDefaultJugadores(false);
                    } else {
                        $scope.jugadoresLista.opcion = $scope.jugList[0];
                        anadirDefaultJugadores(true);
                    }
                }
            });

        };

        $scope.selectedPresionesLista = function () {
            console.log("PRESIONES: " + $scope.presionesLista.opcion)
        };

        $scope.eliminar = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Eliminar Parejas',
                template: '¿Estás seguro que deseas eliminar estas parejas?',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive',
                okText: 'Eliminar'

            });

            confirmPopup.then(function (res) {
                if (res) {
                    alertPopupOpcionesCampo.close();

                    var query = 'DELETE FROM foursome WHERE id = ?';
                    $cordovaSQLite.execute(db, query, [idPareja])
                        .then(function (res) {
                            // console.log(JSON.stringify(res))
                            $scope.parejas.splice(index, 1);
                        }, function (err) {
                            // console.log(JSON.stringify(err))
                        });

                }
            });

        };

        $scope.actualizar = function () {

            isCrearPareja = false;

            for (var i = 0; i < $scope.parejas.length; i++) {

                if (idPareja == $scope.parejas[i].id) {

                    $scope.listaUno.opcion = jugadoresList[$scope.parejas[i].p1_j1_idx];
                    $scope.listaDos.opcion = jugadoresList[$scope.parejas[i].p1_j2_idx];

                    handicapIgual($scope.listaUno.opcion, $scope.listaDos.opcion, $scope.listJN5, 1);

                    $scope.listaTres.opcion = jugadoresList[$scope.parejas[i].p2_j1_idx];
                    $scope.listaCuatro.opcion = jugadoresList[$scope.parejas[i].p2_j2_idx];

                    handicapIgual($scope.listaTres.opcion, $scope.listaCuatro.opcion, $scope.listJN6, 2);

                    break;
                }
            }

            alertCrearParejas('crear_parejas_popup.html', 'Actualizar');
        };

        function eliminarParejas() {

            var query = "DELETE FROM foursome";

            sql.sqlQuery(db, query, [])
                .then(function (res) {
                    for (var i = 0; i < $scope.parejas.length; i++) {
                        $scope.parejas.splice(i, 1);
                    }
                    for (var i = 0; i < $scope.parejasIndividual.length; i++) {
                        $scope.parejasIndividual.splice(i, 1);
                    }

                    switch ($scope.jugadoresLista.opcion) {
                        case "1 VS 1":
                            $scope.pareja_individual = true;
                            $scope.pareja_doble = false;
                            $scope.dosJugadores = false;

                            $scope.handicapIgual = false;
                            $scope.handicapIgualDos = false;

                            $scope.listaCinco.opcion = null;
                            $scope.listaSeis.opcion = null;

                            break;
                        case "2 VS 2":
                            $scope.pareja_individual = false;
                            $scope.pareja_doble = true;
                            $scope.dosJugadores = true;
                            break;
                    }
                })
                .catch(function (error) {

                });
        }

        function alertOpcionesCampo(url) {
            alertPopupOpcionesCampo = $ionicPopup.alert({
                templateUrl: 'templates/' + url,
                title: 'Pareja VS Pareja',
                scope: $scope,
                okText: 'Cancelar',
                okType: 'button-balanced'
            });
        }

        function alertCrearParejas(url, title) {
            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/' + url,
                title: title + ' Parejas',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: title,
                        type: 'button-balanced',
                        onTap: function (e) {
                            if ($scope.dosJugadores) {
                                parejasDobles(e);
                            } else {
                                parejaIndividual(e);
                            }
                        }
                    }
                ]
            });
        }

        function getJugadores() {

            var defered = $q.defer();
            var promise = defered.promise;

            var query = "SELECT * FROM jugador WHERE jugar = 1 ORDER BY handicap, nombre ASC";

            sql.sqlQuery(db, query, [])
                .then(function (res) {

                    for (var i = 0; i < res.rows.length; i++) {

                        var jug = {
                            id: res.rows.item(i).id,
                            nombre: res.rows.item(i).nombre,
                            handicap: res.rows.item(i).handicap,
                            jugar: true
                        };

                        jugadoresList.push(jug);

                        $scope.listJN1.push(jug);
                        $scope.listJN2.push(jug);
                        $scope.listJN3.push(jug);
                        $scope.listJN4.push(jug);

                    }

                    defered.resolve("OK");
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        };

        function anadirDefaultJugadores(parejaDoble) {

            if (parejaDoble) {
                $scope.pareja_individual = false;
                $scope.pareja_doble = true;
                $scope.dosJugadores = true;

                $scope.jugadoresLista.opcion = $scope.jugList[1];
                $scope.presionesLista.opcion = $scope.preList[0];

                $scope.listaUno.opcion = jugadoresList[0]
                $scope.listJN2.splice(0, 1);

                $scope.listaDos.opcion = jugadoresList[1]
                $scope.listJN1.splice(1, 1);

                handicapIgual($scope.listaUno.opcion, $scope.listaDos.opcion, $scope.listJN5, 1);

                indexJug.jug_1 = buscadorIndex($scope.listaUno.opcion);
                indexJug.jug_2 = buscadorIndex($scope.listaDos.opcion);

                $scope.listaTres.opcion = jugadoresList[2]
                $scope.listJN4.splice(2, 1);

                $scope.listaCuatro.opcion = jugadoresList[3]
                $scope.listJN3.splice(3, 1);

                handicapIgual($scope.listaTres.opcion, $scope.listaCuatro.opcion, $scope.listJN6, 2);

                indexJug.jug_3 = buscadorIndex($scope.listaTres.opcion);
                indexJug.jug_4 = buscadorIndex($scope.listaCuatro.opcion);

            } else {
                $scope.pareja_individual = true;
                $scope.pareja_doble = false;
                $scope.dosJugadores = false;

                $scope.jugadoresLista.opcion = $scope.jugList[0];
                $scope.presionesLista.opcion = $scope.preList[0];

                $scope.listaDos.opcion = jugadoresList[0]
                $scope.listJN3.splice(0, 1);

                $scope.listaTres.opcion = jugadoresList[1]
                $scope.listJN2.splice(1, 1);
            }

        }

        function getParejasDobles() {

            var defered = $q.defer();
            var promise = defered.promise;

            var query = "SELECT * FROM foursome";

            sql.sqlQuery(db, query, [])
                .then(function (res) {

                    if (res.rows.length > 0) {
                        if (res.rows.item(0).p2_j1_id != null) {
                            for (var i = 0; i < res.rows.length; i++) {
                                $scope.parejas.push({

                                    id: res.rows.item(i).id,
                                    p1_j1_id: res.rows.item(i).p1_j1_id,
                                    p1_j1_nombre: res.rows.item(i).p1_j1_nombre,
                                    p1_j1_handicap: res.rows.item(i).p1_j1_handicap,
                                    p1_j1_idx: res.rows.item(i).p1_j1_idx,
                                    p1_j2_id: res.rows.item(i).p1_j2_id,
                                    p1_j2_nombre: res.rows.item(i).p1_j2_nombre,
                                    p1_j2_handicap: res.rows.item(i).p1_j2_handicap,
                                    p1_j2_idx: res.rows.item(i).p1_j2_idx,
                                    p1_jug_ventaja: res.rows.item(i).p1_jug_ventaja,
                                    p2_j1_id: res.rows.item(i).p2_j1_id,
                                    p2_j1_nombre: res.rows.item(i).p2_j1_nombre,
                                    p2_j1_handicap: res.rows.item(i).p2_j1_handicap,
                                    p2_j1_idx: res.rows.item(i).p2_j1_idx,
                                    p2_j2_id: res.rows.item(i).p2_j2_id,
                                    p2_j2_nombre: res.rows.item(i).p2_j2_nombre,
                                    p2_j2_handicap: res.rows.item(i).p2_j2_handicap,
                                    p2_j2_idx: res.rows.item(i).p2_j2_idx,
                                    p2_jug_ventaja: res.rows.item(i).p2_jug_ventaja


                                });
                                lengthParejas.doble++;
                            }
                        }
                    }

                    defered.resolve("OK");
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        }

        function getParejaIndividual() {

            var defered = $q.defer();
            var promise = defered.promise;

            var query = "SELECT * FROM foursome";

            sql.sqlQuery(db, query, [])
                .then(function (res) {

                    if (res.rows.length > 0) {
                        if (res.rows.item(0).p2_j1_id == null) {
                            for (var i = 0; i < res.rows.length; i++) {
                                $scope.parejasIndividual.push({

                                    id: res.rows.item(i).id,
                                    p1_j1_id: res.rows.item(i).p1_j1_id,
                                    p1_j1_nombre: res.rows.item(i).p1_j1_nombre,
                                    p1_j1_handicap: res.rows.item(i).p1_j1_handicap,
                                    p1_j2_id: res.rows.item(i).p1_j2_id,
                                    p1_j2_nombre: res.rows.item(i).p1_j2_nombre,
                                    p1_j2_handicap: res.rows.item(i).p1_j2_handicap

                                });
                                lengthParejas.individual++;
                            }
                        }
                    }

                    defered.resolve("OK");
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        }

        function getParejas() {

            $q.when()
                .then(function () {
                    console.log('1', '2');
                    return getParejasDobles();
                })
                .then(function () {
                    console.log('3', '4');
                    return getParejaIndividual();
                })
                .then(function () {
                    console.log('5', '6');
                    return getJugadores();
                })
                .then(function () {
                    console.log('1', '2');

                    if (lengthParejas.doble >= lengthParejas.individual) {
                        anadirDefaultJugadores(true)
                    } else {
                        anadirDefaultJugadores(false)
                    }
                })
                .catch(function (error) {
                    console.log('JuegoFoursome', error);
                    utils.popup('Error', error);
                })
                .finally(function () {

                });
        }

        $ionicPlatform.ready(function () {
            getParejas()
        });

    });
