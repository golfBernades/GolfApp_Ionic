/**
 * Esta función crea una instancia de un objeto de tipo Campo, que es el
 * Campo donde se llevará a cabo un partido.
 *
 * @param pares Son los pares de los hoyos del Campo.
 * @param ventajas Son las ventajas que corresponden a cada hoyo del Campo.
 *
 * @author Porfirio Ángel Díaz Sánchez
 */
function Campo(pares, ventajas) {
  if (typeof(pares) == 'undefined')
    pares = [];
  if (typeof(ventajas) == 'undefined')
    ventajas = [];

  this.pares = pares;
  this.ventajas = ventajas;
}
