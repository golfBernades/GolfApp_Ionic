/**
 * Created by Victor Hugo on 22/03/2017.
 */
angular.module('starter.seleccion-jugadores', ['ionic'])

  .controller('ctrlNJ', function ($scope, $ionicPopup) {
    $scope.jugadores = [];

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
                //$scope.jugadores.push({'nombre': nombre, 'handicap':handicap});
                $scope.jugadores.push(new Jugador(0,nombre,"",handicap,"","","",""));



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

                $scope.jugadores[index].nombre = nomb;
                $scope.jugadores[index].handicap = handi;

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

  });
