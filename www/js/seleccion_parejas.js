/**
 * Created by Victor Hugo on 22/03/2017.
 */
angular.module('starter.seleccion-parejas', ['ionic'])

    .controller('parejasController', function ($scope, $ionicPopup,
                                               $cordovaSQLite, $state,
                                               $ionicPlatform, utils) {
        var jugadoresList = [];

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

        $scope.parejas = [];
        $scope.parejasIndividual =[];

        var j_1;
        var j_2;
        var j_3;
        var j_4;
        var j_5;
        var j_6;

        var alertPopupOpcionesCampo;
        var index;
        var idPareja;

        $scope.comenzarJuego = function () {
            if ($scope.parejas.length) {
                $state.go('juego');
            } else {
                utils.popup("Crear Parejas", "Para poder avanzar debes haber creado las parejas a competir.")
            }
        };

        $scope.seleccionarApuesta = function () {
            $state.go("seleccion_apuestas")
        };

        $scope.addParejas = function () {
            $scope.data = {};

            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/crear_parejas_popup.html',
                title: 'Crear Parejas',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: 'Agregar',
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
        };

        function parejasDobles(e) {

            var ventaja = {
                j_1: 0,
                j_2: 0
            };

            console.log(parejaExistenteDoble($scope.listaUno.opcion, $scope.listaDos.opcion))
            console.log(parejaExistenteDoble($scope.listaTres.opcion, $scope.listaCuatro.opcion))

            var res_1 = parejaExistenteDoble($scope.listaUno.opcion, $scope.listaDos.opcion);
            var res_2 = parejaExistenteDoble($scope.listaTres.opcion, $scope.listaCuatro.opcion);

            var pareja_rep = false;

            if(res_1 & res_2){
                pareja_rep = true;
            }else if(!res_1 & !res_2){
                pareja_rep = false;
            }else if(res_1 & !res_2){
                pareja_rep = false;
            }else{
                pareja_rep = false;
            }

            if(!pareja_rep){
                if(validarParejas()){

                    if($scope.handicapIgual){
                        if($scope.listaCinco.opcion.id == null){
                            utils.popup("Seleccionar Jugador", "Seleccionar jugador con preferencia en Handicap para la pareja 1.")
                            e.preventDefault();
                            return;
                        }else{
                            ventaja.j_1 = handicapMayor($scope.listaUno.opcion, $scope.listaDos.opcion, 1);
                        }
                    }else{
                        ventaja.j_1 = handicapMayor($scope.listaUno.opcion, $scope.listaDos.opcion, 1);
                    }

                    if($scope.handicapIgualDos){
                        if($scope.listaSeis.opcion.id == null){
                            utils.popup("Seleccionar Jugador", "Seleccionar jugador con preferencia en Handicap para la pareja 2.")
                            e.preventDefault();
                            return
                        }else{
                            ventaja.j_2 = handicapMayor($scope.listaTres.opcion, $scope.listaCuatro.opcion, 2);
                        }
                    }else{
                        ventaja.j_2 = handicapMayor($scope.listaTres.opcion, $scope.listaCuatro.opcion, 2);
                    }

                    var insertQuery = 'INSERT INTO foursome (modalidad, '
                        + 'p1_j1_id, p1_j1_nombre, p1_j2_id, p1_j2_nombre,'
                        + ' p1_ventaja_j_id,'
                        + ' p2_j1_id, p2_j1_nombre, p2_j2_id, p2_j2_nombre,'
                        + ' p2_ventaja_j_id'
                        + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

                    var queryData = ['pareja_normal', $scope.listaUno.opcion.id, $scope.listaUno.opcion.nombre + ' ('
                    + $scope.listaUno.opcion.handicap + ')', $scope.listaDos.opcion.id, $scope.listaDos.opcion.nombre + ' (' + $scope.listaDos.opcion.handicap
                    + ')', ventaja.j_1, $scope.listaTres.opcion.id, $scope.listaTres.opcion.nombre + ' (' + $scope.listaTres.opcion.handicap
                    + ')', $scope.listaCuatro.opcion.id, $scope.listaCuatro.opcion.nombre + ' (' + $scope.listaCuatro.opcion.handicap + ')',
                        ventaja.j_2];

                    $cordovaSQLite.execute(db, insertQuery, queryData)
                        .then(function (res) {
                            $scope.parejas.push({
                                id: res.insertId,
                                p1_j1_id: $scope.listaUno.opcion.id,
                                p1_j1_nombre: $scope.listaUno.opcion.nombre + " (" + $scope.listaUno.opcion.handicap + ")",
                                p1_j2_id: $scope.listaDos.opcion.id,
                                p1_j2_nombre: $scope.listaDos.opcion.nombre + " (" + $scope.listaDos.opcion.handicap + ")",
                                p2_j1_id: $scope.listaTres.opcion.id,
                                p2_j1_nombre: $scope.listaTres.opcion.nombre + " (" + $scope.listaTres.opcion.handicap + ")",
                                p2_j2_id: $scope.listaCuatro.opcion.id,
                                p2_j2_nombre: $scope.listaCuatro.opcion.nombre + " (" + $scope.listaCuatro.opcion.handicap + ")",
                                ventaja_p_1: ventaja.j_1,
                                ventaja_p_2: ventaja.j_2
                            });
                        }, function (err) {
                            console.log(JSON.stringify(err))
                        });

                }else{
                    utils.popup("Pareja Invalida",
                        "Para poder avanzar formar una pareja valida, no repetir dos veces, los dos jugadores.");
                    e.preventDefault();
                }
            }else {
                utils.popup("Pareja Repetida",  "Para poder avanzar formar una pareja no existente.");
                e.preventDefault();
            }


        }

        function parejaIndividual(e) {


            if(parejaExistenteIndividual($scope.listaDos.opcion,$scope.listaTres.opcion)){
                var insertQuery = 'INSERT INTO foursome (modalidad, '
                    + 'p1_j1_id, p1_j1_nombre, p1_j2_id, p1_j2_nombre'
                    + ') VALUES (?, ?, ?, ?, ?);';

                var queryData = ['individual_normal', $scope.listaDos.opcion.id, $scope.listaDos.opcion.nombre + ' (' + $scope.listaDos.opcion.handicap + ')',
                    $scope.listaTres.opcion.id, $scope.listaTres.opcion.nombre + ' (' + $scope.listaTres.opcion.handicap+')'];

                $cordovaSQLite.execute(db, insertQuery, queryData)
                    .then(function (res) {
                        $scope.parejasIndividual.push({
                            id: res.insertId,
                            p1_j1_id: $scope.listaDos.opcion.id,
                            p1_j1_nombre: $scope.listaDos.opcion.nombre + " (" + $scope.listaDos.opcion.handicap + ")",
                            p1_j1_id: $scope.listaTres.opcion.id,
                            p1_j2_nombre: $scope.listaTres.opcion.nombre + " (" + $scope.listaTres.opcion.handicap + ")"

                        });
                    }, function (err) {
                        console.log(JSON.stringify(err))
                    });
            }else{

                utils.popup("Pareja Repetida",
                    "Para poder avanzar formar una pareja no existente.");
                e.preventDefault();
            }


        }

        function handicapMayor(jug_1, jug_2, par) {
            if (jug_1.handicap > jug_2.handicap) {
                return jug_1.id;
            } else if (jug_1.handicap < jug_2.handicap) {
                return jug_2.id;
            } else {
                if (par == 1) {
                    return $scope.listaCinco.opcion.id;
                } else {
                    return $scope.listaSeis.opcion.id;
                }
            }
        }

        function agregarJugadoresSelect(jugador, list) {

            for(var i=0; i<jugadoresList.length; i++){
                list.pop();
            }

            for (var i = 0; i < jugadoresList.length; i++) {
                if(jugador.id != jugadoresList[i].id){
                    list.push(jugadoresList[i]);
                }
            }


        }

        function handicapIgual(jug_1 , jug_2, list, pareja) {

            for(var i=0; i<2; i++){
                list.pop()
            }
            if(jug_2 != null){
                if (jug_1.handicap == jug_2.handicap) {

                    list.push(jug_1);
                    list.push(jug_2);

                    if(pareja == 1){
                        $scope.handicapIgual = true;
                    }else{
                        $scope.handicapIgualDos = true;
                    }
                } else {
                    if(pareja == 1){
                        $scope.handicapIgual = false;
                    }else{
                        $scope.handicapIgualDos = false;
                    }
                }
            }
        }

        function parejaExistenteDoble(jug_1, jug_2) {

            var cont=0;
            for(var i=0; i<$scope.parejas.length; i++){

                if(jug_1.id == $scope.parejas[i].p1_j1_id){
                    cont++;
                }
                if(jug_1.id == $scope.parejas[i].p1_j2_id){
                    cont++;
                }
                if(jug_1.id == $scope.parejas[i].p2_j1_id){
                    cont++;
                }
                if(jug_1.id == $scope.parejas[i].p2_j2_id){
                    cont++;
                }

                if(cont == 1){
                    cont=0;
                }

                if(jug_2.id == $scope.parejas[i].p1_j1_id){
                    cont++;
                }
                if(jug_2.id == $scope.parejas[i].p1_j2_id){
                    cont++;
                }
                if(jug_2.id == $scope.parejas[i].p2_j1_id){
                    cont++;
                }
                if(jug_2.id == $scope.parejas[i].p2_j2_id){
                    cont++;
                }

                if(cont>=2){
                    break
                }
            }

            console.log(cont +" cont")

            if(cont>=2){
                return true;
            }else{
                return false;
            }
        }

        function parejaExistenteIndividual(jug_1, jug_2) {
            var cont=0;
            for(var i; i<$scope.parejasIndividual.length; i++){

                if(jug_1.id == $scope.parejasIndividual[i].p1_j1_id){
                    cont++;
                }
                if(jug_1.id == $scope.parejasIndividual[i].p1_j2_id){
                    cont++;
                }
                if(jug_2.id == $scope.parejasIndividual[i].p1_j1_id){
                    cont++;
                }
                if(jug_2.id == $scope.parejasIndividual[i].p1_j2_id){
                    cont++;
                }

                if(cont == 2){
                    break;
                }
            }

            if(cont == 2){
                return false;
            }else{
                return true;
            }
        }

        function validarParejas() {

            var cont=0;

            if($scope.listaUno.opcion.id == $scope.listaTres.opcion.id){
                cont++;
            }
            if($scope.listaUno.opcion.id == $scope.listaCuatro.opcion.id){
                cont++;
            }
            if($scope.listaDos.opcion.id == $scope.listaTres.opcion.id){
                cont++;
            }
            if($scope.listaDos.opcion.id == $scope.listaCuatro.opcion.id){
                cont++;
            }

            if(cont==2){
                return false;
            }else{
                return true;
            }
        }

        function agregarMudo(jug, list_1, list_2) {
            if (jug.nombre == "Mudo") {
                list_1 = [];
                list_2 = [];
                for (var i = 0; i < jugadoresList.length; i++) {
                    if (jug.id != jugadoresList[i].id) {
                        list_2.push(jugadoresList[i]);
                        list_2.push(jugadoresList[i]);
                    }
                }
            }
        }

        function juegoIndividual(jug, list) {

            if($scope.dosJugadores == false){
                list = [];

                for (var i = 0; i < jugadoresList.length; i++) {
                    if (jug.id != jugadoresList[i].id) {
                        list.push(jugadoresList[i]);
                    }
                }
            }
        }

        $scope.popupOpcionesParejas = function (idp, idx) {
            index = idx;
            idPareja = idp;
            alertOpcionesCampo("edit_delete_campo.html");
        };

        $scope.selectedListaUno = function () {

            agregarJugadoresSelect($scope.listaUno.opcion, $scope.listJN2);
            handicapIgual($scope.listaUno.opcion, $scope.listaDos.opcion, $scope.listJN5, 1);
        };

        $scope.selectedListaDos = function () {

            agregarJugadoresSelect($scope.listaDos.opcion, $scope.listJN1);
            handicapIgual($scope.listaDos.opcion, $scope.listaUno.opcion, $scope.listJN5, 1);
        };

        $scope.selectedListaTres = function () {

            agregarJugadoresSelect($scope.listaTres.opcion, $scope.listJN4);
            handicapIgual($scope.listaTres.opcion, $scope.listaCuatro.opcion, $scope.listJN6, 2);
        };

        $scope.selectedListaCuatro = function () {

            agregarJugadoresSelect($scope.listaCuatro.opcion, $scope.listJN3);
            handicapIgual($scope.listaCuatro.opcion, $scope.listaTres.opcion, $scope.listJN6, 2);

        };

        $scope.selectedListaCinco = function () {
            j_5 = $scope.listaCinco.opcion;
        };

        $scope.selectedListaSeis = function () {
            j_6 = $scope.listaSeis.opcion;
        }

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
                            console.log(JSON.stringify(res))
                            $scope.parejas.splice(index, 1);
                        }, function (err) {
                            console.log(JSON.stringify(err))
                        });

                }
            });

        };

        $scope.actualizar = function () {

        };

        function alertOpcionesCampo(url) {
            alertPopupOpcionesCampo = $ionicPopup.alert({
                templateUrl: 'templates/' + url,
                title: 'Pareja VS Pareja',
                scope: $scope,
                okText: 'Cancelar',
                okType: 'button-balanced'
            });
        }

        function getJugadores() {

            var query = "SELECT * FROM jugador WHERE usuario_id = (?) AND jugar = 1";
            $cordovaSQLite.execute(db, query, [id_user_app]).then(function (res) {
                if (res.rows.length > 0) {

                    for (var i = 0; i < res.rows.length; i++) {

                        console.log(res.rows.item(i).id + " " + res.rows.item(i).jugar + " ------------------")

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

                    if ((res.rows.length % 2) != 0) {

                        var mudo = {
                            id: 54321,
                            nombre: "Mudo",
                            handicap: 0,
                            jugar: true
                        };


                        jugadoresList.push(mudo);

                        $scope.listJN1.push(mudo);
                        $scope.listJN2.push(mudo);
                        $scope.listJN3.push(mudo);
                        $scope.listJN4.push(mudo);

                    }

                    añadirDefaultJugadores(res.rows.length)

                    if (res.rows.length == 2) {
                        $scope.pareja_individual = true;
                        $scope.pareja_doble = false;
                        $scope.dosJugadores = false;

                        getParejaIndividual();

                    } else {
                        $scope.pareja_individual = false;
                        $scope.pareja_doble = true;

                        getParejasDobles();
                    }

                }

            }, function (err) {
                JSON.stringify(err)
            });
        };

        function añadirDefaultJugadores(jugadores) {

            if(jugadores == 2){
                $scope.listaDos.opcion = jugadoresList[0]
                $scope.listJN3.splice(0,1);

                $scope.listaTres.opcion = jugadoresList[1]
                $scope.listJN2.splice(1,1);

            }else if(jugadores== 3){

            }else if(jugadores>=4){
                $scope.listaUno.opcion = jugadoresList[0]
                $scope.listJN2.splice(0,1);

                $scope.listaDos.opcion = jugadoresList[1]
                $scope.listJN1.splice(1,1);

                handicapIgual($scope.listaUno.opcion, $scope.listaDos.opcion,$scope.listJN5,1);

                $scope.listaTres.opcion = jugadoresList[2]
                $scope.listJN4.splice(2,1);

                $scope.listaCuatro.opcion = jugadoresList[3]
                $scope.listJN3.splice(3,1);

                handicapIgual($scope.listaTres.opcion, $scope.listaCuatro.opcion,$scope.listJN6,2);
            }
        }

        function getParejasDobles() {

            var query = "SELECT * FROM foursome WHERE modalidad = (?)";
            $cordovaSQLite.execute(db, query, ['pareja_normal']).then(function (res) {

                for (var i = 0; i < res.rows.length; i++) {

                    $scope.parejas.push({
                        id: res.rows.item(i).id,
                        p1_j1_id: res.rows.item(i).p1_j1_id,
                        p1_j1_nombre: res.rows.item(i).p1_j1_nombre,
                        p1_j2_id: res.rows.item(i).p1_j2_id,
                        p1_j2_nombre: res.rows.item(i).p1_j2_nombre,
                        p2_j1_id: res.rows.item(i).p2_j1_id,
                        p2_j1_nombre: res.rows.item(i).p2_j1_nombre,
                        p2_j2_id: res.rows.item(i).p2_j2_id,
                        p2_j2_nombre: res.rows.item(i).p2_j2_nombre
                    });

                }
            }, function (err) {
                JSON.stringify(err)
            });
        }

        function getParejaIndividual() {
            console.log("Holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

            var query = "SELECT * FROM foursome WHERE modalidad = (?)";
            $cordovaSQLite.execute(db, query,['individual_normal']).then(function (res) {

                for (var i = 0; i < res.rows.length; i++) {

                    $scope.parejasIndividual.push({
                        id: res.rows.item(i).id,
                        p1_j1_id: res.rows.item(i).p1_j1_id,
                        p1_j1_nombre: res.rows.item(i).p1_j1_nombre,
                        p1_j2_id: res.rows.item(i).p1_j2_id,
                        p1_j2_nombre: res.rows.item(i).p1_j2_nombre
                    });

                    console.log(JSON.stringify($scope.parejasIndividual[i]))
                }
            }, function (err) {
                JSON.stringify(err)
            });

        }

        $ionicPlatform.ready(function () {
            getJugadores();

        });
    });
