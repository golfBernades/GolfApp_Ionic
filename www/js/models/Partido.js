/**
 * Modelo de la tabla partido.
 *
 * @param id
 * @param clave
 * @param inicio
 * @param fin
 * @param jugador_id
 * @param campo_id
 */
function Partido(id, clave, inicio, fin, jugador_id, campo_id) {
    this.id = id;
    this.clave = clave;
    this.inicio = inicio;
    this.fin = fin;
    this.jugador_id = jugador_id;
    this.campo_id = campo_id;
}