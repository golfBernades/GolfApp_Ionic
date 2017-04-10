/**
 * Created by Victor Hugo on 22/03/2017.
 */

angular.module('starter.seleccion-campo', ['ionic'])

.controller('ctrlCampo', function ($scope) {

  var campos =[
    {nombre:'El verdesillo', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El jerezano', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El zacatecano', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El moriilo', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El motorlo', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El Nose me ocurre', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El acostumbrao', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El nopalero', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El mexican', ubicacion: 'Jerez, Zac. C. Nopal #48'},
    {nombre:'El vecino', ubicacion: 'Jerez, Zac. C. Nopal #48'}
  ];


  $scope.campos = campos;

});
