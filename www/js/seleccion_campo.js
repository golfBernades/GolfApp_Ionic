/**
 * Created by Victor Hugo on 22/03/2017.
 */

angular.module('starter.seleccion-campo', ['ionic'])

.controller('ctrlCampo', function ($scope, $cordovaSQLite) {

  $scope.campos =[
    new Campo('El verdesillo','Jerez Zac. C. Nopal #48')
  ];

  function getCampos() {
    var par =[];
    var ventaja=[];

    setTimeout(function () {
      var query = "SELECT * FROM campo";
      $cordovaSQLite.execute(db, query).then(function(res) {

        if(res.rows.length>0){
          for(var i =0; i<res.rows.length; i++){
            par=[res.rows.item(i).par_hoyo_1, res.rows.item(i).par_hoyo_2, res.rows.item(i).par_hoyo_3, res.rows.item(i).par_hoyo_4, res.rows.item(i).par_hoyo_5, res.rows.item(i).par_hoyo_6, res.rows.item(i).par_hoyo_7,res.rows.item(i).par_hoyo_8, res.rows.item(i).par_hoyo_9, res.rows.item(i).par_hoyo_10, res.rows.item(i).par_hoyo_11, res.rows.item(i).par_hoyo_12, res.rows.item(i).par_hoyo_13, res.rows.item(i).par_hoyo_14, res.rows.item(i).par_hoyo_15,res.rows.item(i).par_hoyo_16, res.rows.item(i).par_hoyo_17, res.rows.item(i).par_hoyo_18];
            ventaja=[res.rows.item(i).ventaja_hoyo_1, res.rows.item(i).ventaja_hoyo_2, res.rows.item(i).ventaja_hoyo_3, res.rows.item(i).ventaja_hoyo_4, res.rows.item(i).ventaja_hoyo_5, res.rows.item(i).ventaja_hoyo_6, res.rows.item(i).ventaja_hoyo_7,res.rows.item(i).ventaja_hoyo_8, res.rows.item(i).ventaja_hoyo_9, res.rows.item(i).ventaja_hoyo_10, res.rows.item(i).ventaja_hoyo_11, res.rows.item(i).ventaja_hoyo_12, res.rows.item(i).ventaja_hoyo_13, res.rows.item(i).ventaja_hoyo_14, res.rows.item(i).ventaja_hoyo_15,res.rows.item(i).ventaja_hoyo_16, res.rows.item(i).ventaja_hoyo_17, res.rows.item(i).ventaja_hoyo_18];
            $scope.campos.push(new Campo(res.rows.item(i).nombre, par,ventaja));
          }
        }
      }, function (err) {
        console.error(err);
      });
    },500)
  }

  getCampos();

})

 .service('setCampo', function () {

   var campoNuevo=null;

     this.hola = function (campo) {
     campoNuevo = campo;
   }

   this.insertarCampo= function(){
     return campoNuevo;
   }

  });
