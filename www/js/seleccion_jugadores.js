/**
 * Created by Victor Hugo on 22/03/2017.
 */
angular.module('starter.seleccion-jugadores', ['ionic'])

  .controller('ctrlNJ', function ($scope, $ionicPopup, $cordovaSQLite) {
    $scope.jugadores = [];


    function getJugadores() {
      setTimeout(function () {
        var query = "SELECT * FROM jugador";
        $cordovaSQLite.execute(db, query).then(function(res) {
          for(var i =0; i<res.rows.length; i++){
            $scope.jugadores.push(new Jugador(res.rows.item(i).id ,res.rows.item(i).nombre,"",res.rows.item(i).handicap,"","","",""))
            console.log(res.rows.item(i).id ,res.rows.item(i).nombre,"",res.rows.item(i).handicap,"","","","")
          }
        }, function (err) {
          console.error(err);
        });
      },500)
    }

    $scope.deleteSkill = function(index) {

      var nombre = $scope.jugadores[index].nombre;
        var confirmPopup = $ionicPopup.confirm({
          title: 'Eliminar Jugador "'+nombre+'"',
          template: 'Estas seguro del eliminar al jugador?',
          cancelText: 'Cancelar',
          cancelType:'button-assertive',
          okText:'Eliminar'

        });

        confirmPopup.then(function(res) {
          if(res) {

            console.log($scope.jugadores[index].id)
            var query = 'DELETE FROM jugador  WHERE id = ?';
            $cordovaSQLite.execute(db, query, [$scope.jugadores[index].id]).then(function(res) {
              console.log("DELETE RES -> " + res);
            }, function (err) {
              console.error(err);
            });
            $scope.jugadores.splice(index, 1);
          } else {

          }
        });
    }

    $scope.addUser = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<p>' +
        '<label>Nombre Jugador:</label>'+
        '<input type="text" ng-model="data.nombreJug" name="data.nombreJug" id="nombreJug">'+
        '</p>'+
        '<p>' +
        '<label>Handicap:</label>'+
        '<input type="number" ng-model="data.handicap" name="data.handicap" id="handicap">'+
        '</p>',
        title: 'Agregar jugadores',
        subTitle: 'Ingresa su Nombre y Handicap',
        scope: $scope,
        buttons: [
          { text: 'Cancel',
            type: 'button-assertive'},
          {
            text: '<b>Guardar</b>',
            type: 'button-balanced',
            onTap: function(e) {
              var nombre= $scope.data.nombreJug;
              var handicap = $scope.data.handicap;

              if(nombre && handicap){

                var query = "INSERT INTO jugador (nombre, handicap) VALUES (?,?)";
                $cordovaSQLite.execute(db, query, [nombre, handicap]).then(function(res) {
                  console.log("INSERT ID -> " + res.insertId);
                  var query = "SELECT * FROM jugador";
                  $cordovaSQLite.execute(db, query).then(function(res) {

                    if(res.rows.length>0){
                      console.log(res.rows.item(0).id);
                      $scope.jugadores.push(new Jugador(res.rows.item(0).id,nombre,"",handicap,"","","",""));
                    }
                  });

                }, function (err) {
                  console.error(err);
                });

                $scope.data.nombreJug ="";
                $scope.data.handicap ="";
                document.getElementById("nombreJug").style.backgroundColor = "#FAFAFA";
                document.getElementById("handicap").style.backgroundColor = "#FAFAFA"

                e.preventDefault();
              }else{
                if(!nombre && !handicap){
                  document.getElementById("nombreJug").style.backgroundColor = "#F5A9A9";
                  document.getElementById("handicap").style.backgroundColor = "#F5A9A9"
                }else if(!nombre){
                  document.getElementById("nombreJug").style.backgroundColor = "#F5A9A9";
                } else if(!handicap){
                  document.getElementById("handicap").style.backgroundColor = "#F5A9A9"
                }

                e.preventDefault();
              }
            }
          }
        ]
      });
    }

    $scope.editUser = function (index) {

      $scope.data = {};

      $scope.data.nombreJugEd =($scope.jugadores[index].nombre);
      $scope.data.handicapEd =($scope.jugadores[index].handicap);

      var nombre = $scope.data.nombreJugEd =($scope.jugadores[index].nombre);

      var myPopup = $ionicPopup.show({
        template:
        '<p>' +
        '<label>Nombre Jugador:</label>'+
        '<input type="text" ng-model="data.nombreJugEd" name="data.nombreJugEd" id="nombreJugEd">'+
        '</p>'+
        '<p>' +
        '<label>Handicap:</label>'+
        '<input type="number" ng-model="data.handicapEd" name="data.handicapEd" id="handicapEd">'+
        '</p>'+
        '<script>',
        title: 'Actualizar Jugador',
        subTitle: 'Actualiza el jugador: '+nombre,
        scope: $scope,

        buttons: [
          { text: 'Cancelar',
            type: 'button-assertive'
          },
          {
            text: '<b>Actualizar</b>',
            type: 'button-balanced',
            onTap: function(e) {
              var nomb= $scope.data.nombreJugEd;
              var handi = $scope.data.handicapEd;


              if(nomb && nomb){

                var query = "UPDATE jugador SET nombre = ?, handicap = ? WHERE id = ?";
                console.log($scope.jugadores[index].id)
                $cordovaSQLite.execute(db, query, [nomb, handi, $scope.jugadores[index].id]).then(function(res) {
                  console.log("UPDATE RES -> " + res);
                  $scope.jugadores[index].nombre = nomb;
                  $scope.jugadores[index].handicap = handi;
                }, function (err) {
                  console.error(err);
                });

              }else{
                if(!nomb && !nomb){
                  document.getElementById("nombreJugEd").style.backgroundColor = "#F5A9A9";
                  document.getElementById("handicapEd").style.backgroundColor = "#F5A9A9"
                }else if(!nomb){
                  document.getElementById("nombreJugEd").style.backgroundColor = "#F5A9A9";
                } else if(!nomb){
                  document.getElementById("handicapEd").style.backgroundColor = "#F5A9A9"
                }
                e.preventDefault();
              }
            }
          }
        ]
      });
    }

    getJugadores();

  });
