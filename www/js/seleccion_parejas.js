/**
 * Created by Victor Hugo on 22/03/2017.
 */
angular.module('starter.seleccion-parejas', ['ionic'])

    .controller('parejasController', function ($scope, $ionicPopup, $cordovaSQLite,
                                                 $state, $ionicPlatform, utils) {


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

        $scope.listaUno ={
            opcion:""
        };
        $scope.listaDos ={
            opcion:""
        };
        $scope.listaTres ={
            opcion:""
        };
        $scope.listaCuatro ={
            opcion:""
        };
        $scope.listaCinco ={
            opcion:""
        };
        $scope.listaSeis ={
            opcion:""
        };

        $scope.parejas = [];

        var j_1;
        var j_2;
        var j_3;
        var j_4;
        var j_5;
        var j_6

        var alertPopupOpcionesCampo;
        var index;
        var idPareja;


        $scope.comenzarJuego = function () {

            if($scope.parejas.length){
                $state.go('juego');
            }else{
                utils.popup("Crear Parejas","Para poder avanzar debes haber creado las parejas a competir.")
            }
        };

        $scope.seleccionarApuesta=function () {
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

                            if($scope.dosJugadores){
                                parejasDobles(e);
                            }else{
                                parejaIndividual(e);
                            }

                        }
                    }
                ]
            });
        };

        function parejasDobles(e) {
            if((j_1!=null)&&(j_2!=null)&&(j_3!=null)&&(j_4!=null)){

                var  ventaja={
                    j_1:0,
                    j_2:0
                }

                if($scope.handicapIgual){
                    if(j_5==null){
                        utils.popup("Seleccionar Jugador", "Seleccionar jugador con preferencia en Handicap para la pareja 1.")
                        e.preventDefault();
                        return;
                    }else{
                        ventaja.j_1 = handicapMayor(j_1, j_2, 1);
                    }
                }else{
                    ventaja.j_1 = handicapMayor(j_1, j_2, 1);
                }

                if($scope.handicapIgualDos){
                    if(j_6==null){
                        utils.popup("Seleccionar Jugador", "Seleccionar jugador con preferencia en Handicap para la pareja 2.")
                        e.preventDefault();
                        return;
                    }else{
                        ventaja.j_2 = handicapMayor(j_3, j_4, 2);
                    }
                }else{
                    ventaja.j_2 = handicapMayor(j_3, j_4, 2);
                }



                var query = "INSERT INTO foursome (j_1_id, j_1_nombre, j_2_id, j_2_nombre, j_3_id, j_3_nombre, j_4_id, j_4_nombre, ventaja_p_1, ventaja_p_2, usuario_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query, [j_1.id, j_1.nombre + " ("+j_1.handicap+")", j_2.id, j_2.nombre + " ("+j_2.handicap+")", j_3.id, j_3.nombre + " ("+j_3.handicap+")", j_4.id, j_4.nombre + " ("+j_4.handicap+")", ventaja.j_1, ventaja.j_1, id_user_app])
                    .then(function (res) {

                        $scope.parejas.push({
                            id: res.insertId,
                            j_1_id: j_1.id,
                            j_1_nombre: j_1.nombre + " ("+j_1.handicap+")",
                            j_2_id: j_2.id,
                            j_2_nombre: j_2.nombre + " ("+j_2.handicap+")",
                            j_3_id: j_3.id,
                            j_3_nombre: j_3.nombre + " ("+j_3.handicap+")",
                            j_4_id: j_4.id,
                            j_4_nombre: j_4.nombre + " ("+j_4.handicap+")",
                            ventaja_p_1: ventaja.j_1,
                            ventaja_p_2: ventaja.j_2,
                            jugador_id: id_user_app
                        })

                    }, function (err) {
                        console.log(JSON.stringify(err))
                    });


            }else{
                utils.popup("Seleccionar Jugadores","Seleccionar jugadores de las dos parejas para poder avanzar.")
                e.preventDefault();
            }
        }

        function handicapMayor(jug_1, jug_2, par) {

            if(jug_1.handicap>jug_2.handicap){
                return jug_1.id;
            }else if (jug_1.handicap<jug_2.handicap){
                return jug_2.id;
            }else{
                if(par == 1){
                    return j_5.id;
                }else{
                    return j_6.id;
                }
            }
        }

        function parejaIndividual(e) {

            if((j_2!=null)&&(j_3!=null)){

                var query = "INSERT INTO foursomeTwo (j_1_id, j_1_nombre, j_2_id, j_2_nombre, usuario_id) VALUES (?,?,?,?,?)";
                $cordovaSQLite.execute(db, query, [j_2.id, j_2.nombre + " ("+j_2.handicap+")", j_3.id, j_3.nombre + " ("+j_3.handicap+")", id_user_app])
                    .then(function (res) {

                        $scope.parejas.push({
                            id: res.insertId,
                            j_1_id: "",
                            j_1_nombre: "",
                            j_2_id: j_2.id,
                            j_2_nombre: j_2.nombre + " ("+j_2.handicap+")",
                            j_3_id: j_3.id,
                            j_3_nombre: j_3.nombre + " ("+j_3.handicap+")",
                            j_4_id: "",
                            j_4_nombre: "",
                            ventaja: 0,
                            jugador_id: id_user_app
                        })

                    }, function (err) {
                        console.log(JSON.stringify(err))
                    });


            }else{
                utils.popup("Seleccionar Jugadores","Seleccionar jugadores de las dos parejas para poder avanzar.")
                e.preventDefault();
            }
        }

        $scope.popupOpcionesParejas= function(idp,idx) {
            index = idx;
            idPareja = idp;

            alertOpcionesCampo("edit_delete_campo.html");
        };

        $scope.selectedListaUno = function(){
            j_1 = $scope.listaUno.opcion;
            $scope.listJN2 = [];

            for(var i=0; i<jugadoresList.length; i++){
                if($scope.listaUno.opcion.id != jugadoresList[i].id){
                    $scope.listJN2.push(jugadoresList[i]);
                }
            }

            if(j_1.nombre == "Mudo"){
                $scope.listJN3 = [];
                $scope.listJN4 = [];
                for(var i=0; i<jugadoresList.length; i++){
                    if($scope.listaUno.opcion.id != jugadoresList[i].id){
                        $scope.listJN3.push(jugadoresList[i]);
                        $scope.listJN4.push(jugadoresList[i]);
                    }
                }
            }

            if(j_2 != null){
                if(j_1.handicap == j_2.handicap){
                    $scope.listJN5.push(j_1);
                    $scope.listJN5.push(j_2);
                    $scope.handicapIgual = true;
                }else{
                    $scope.listJN5 = [];
                    $scope.handicapIgual = false;
                }
            }

        };

        $scope.selectedListaDos = function(){
            j_2 = $scope.listaDos.opcion;
            $scope.listJN1 = [];

            for(var i=0; i<jugadoresList.length; i++){
                if($scope.listaDos.opcion.id != jugadoresList[i].id){
                    $scope.listJN1.push(jugadoresList[i]);
                }
            }

            if(j_2.nombre == "Mudo"){
                $scope.listJN3 = [];
                $scope.listJN4 = [];
                for(var i=0; i<jugadoresList.length; i++){
                    if($scope.listaDos.opcion.id != jugadoresList[i].id){
                        $scope.listJN3.push(jugadoresList[i]);
                        $scope.listJN4.push(jugadoresList[i]);
                    }
                }
            }

            if($scope.dosJugadores == false){
                $scope.listJN3 = [];
                for(var i=0; i<jugadoresList.length; i++){
                    if($scope.listaDos.opcion.id != jugadoresList[i].id){
                        $scope.listJN3.push(jugadoresList[i]);
                    }
                }
            }

            if(j_1 != null){
                if(j_1.handicap == j_2.handicap){
                    $scope.listJN5.push(j_1);
                    $scope.listJN5.push(j_2);
                    $scope.handicapIgual = true;
                }else{
                    $scope.listJN5 = [];
                    $scope.handicapIgual = false;
                }
            }

        };

        $scope.selectedListaTres = function(){

            j_3 = $scope.listaTres.opcion;
            $scope.listJN4 = [];

            for(var i=0; i<jugadoresList.length; i++){
                if($scope.listaTres.opcion.id != jugadoresList[i].id){
                    $scope.listJN4.push(jugadoresList[i]);
                }
            }

            if(j_4 != null){
                if(j_3.handicap == j_4.handicap){
                    $scope.listJN6.push(j_3);
                    $scope.listJN6.push(j_4);
                    $scope.handicapIgualDos = true;
                }else{
                    $scope.listJN6 = [];
                    $scope.handicapIgualDos = false;
                }
            }

            if($scope.dosJugadores == false){
                $scope.listJN2 = [];
                for(var i=0; i<jugadoresList.length; i++){
                    if($scope.listaTres.opcion.id != jugadoresList[i].id){
                        $scope.listJN2.push(jugadoresList[i]);
                    }
                }
            }

        };

        $scope.selectedListaCuatro = function(){

            j_4 = $scope.listaCuatro.opcion;
            $scope.listJN3 = [];

            for(var i=0; i<jugadoresList.length; i++){
                if(j_4.id != jugadoresList[i].id){
                    $scope.listJN3.push(jugadoresList[i]);
                }
            }

            if(j_3 != null){
                if(j_3.handicap == j_4.handicap){
                    $scope.listJN6.push(j_3);
                    $scope.listJN6.push(j_4);
                    $scope.handicapIgualDos = true;
                }else{
                    $scope.listJN6 = [];
                    $scope.handicapIgualDos = false;
                }
            }
        };

        $scope.selectedListaCinco = function(){
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
                        },function (err) {
                            console.log(JSON.stringify(err))
                        });

                }
            });

        };

        $scope.actualizar = function () {

        };

        function alertOpcionesCampo(url) {
            alertPopupOpcionesCampo = $ionicPopup.alert({
                templateUrl: 'templates/'+url,
                title: 'Pareja VS Pareja',
                scope: $scope,
                okText:'Cancelar',
                okType:'button-balanced'
            });
        }

        function getJugadores() {

            var query = "SELECT * FROM jugador WHERE usuario_id = (?) AND jugar = 1";
            $cordovaSQLite.execute(db, query, [id_user_app]).then(function (res) {
                if (res.rows.length > 0) {

                    for (var i = 0; i < res.rows.length; i++) {

                        console.log(res.rows.item(i).id + " " + res.rows.item(i).jugar+ " ------------------")

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

                    };

                    if((res.rows.length% 2)!=0 ){

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

                    if(res.rows.length==2){
                        getParejaIndividual();
                        $scope.dosJugadores = false;
                    }else{
                        getParejasDobles();
                    }

                }

            }, function (err) {
                JSON.stringify(err)
            });
        };

        function getParejasDobles() {

            var query = "SELECT * FROM foursome WHERE usuario_id = (?)";
            $cordovaSQLite.execute(db, query, [id_user_app]).then(function (res) {

                for (var i=0; i<res.rows.length; i++){

                    $scope.parejas.push({
                        id: res.rows.item(i).id,
                        j_1_id: res.rows.item(i).j_1_id,
                        j_1_nombre: res.rows.item(i).j_1_nombre,
                        j_2_id: res.rows.item(i).j_2_id,
                        j_2_nombre: res.rows.item(i).j_3_nombre,
                        j_3_id: res.rows.item(i).j_3_id,
                        j_3_nombre: res.rows.item(i).j_3_nombre,
                        j_4_id: res.rows.item(i).j_4_id,
                        j_4_nombre: res.rows.item(i).j_4_nombre,
                        ventaja_p_1: res.rows.item(i).ventaja_p_1,
                        ventaja_p_2: res.rows.item(i).ventaja_p_2,
                        jugador_id: id_user_app
                    });

                }
            }, function (err) {
                JSON.stringify(err)
            });
        }

        function getParejaIndividual() {
            var query = "SELECT * FROM foursomeTwo WHERE usuario_id = (?)";
            $cordovaSQLite.execute(db, query, [id_user_app]).then(function (res) {

                for (var i=0; i<res.rows.length; i++){

                    $scope.parejas.push({
                        id: res.rows.item(i).id,
                        j_1_id: "",
                        j_1_nombre: "",
                        j_2_id: res.rows.item(i).j_1_id,
                        j_2_nombre: res.rows.item(i).j_1_nombre,
                        j_3_id: res.rows.item(i).j_2_id,
                        j_3_nombre: res.rows.item(i).j_2_nombre,
                        j_4_id: "",
                        j_4_nombre: "",
                        ventaja: 0,
                        jugador_id: id_user_app
                    });

                }
            }, function (err) {
                JSON.stringify(err)
            });
        }

        $ionicPlatform.ready(function () {
            getJugadores();

        });
    });
