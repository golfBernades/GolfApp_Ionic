/**
 * Created by Victor Hugo on 22/03/2017.
 */

angular.module('starter.seleccion-campo', ['ionic'])

.controller('ctrlCampo', function ($scope, setCampo) {

  $scope.campos =[
    new Campo('El verdesillo','Jerez Zac. C. Nopal #48')
  ];


   var campo = setCampo.insertarCampo();

   if(campo!=null){
     console.log("agregado "+campo.nombre)
     $scope.campos.push(campo);
   }



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
