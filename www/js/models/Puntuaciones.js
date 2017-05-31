/**
 * Modelo de la tabla puntuaciones.
 *
 * @param id
 * @param hoyo
 * @param golpes
 * @param unidades
 * @param jugador_id
 * @param partido_id
 */
function Puntuaciones(id, hoyo, golpes, unidades, jugador_id, partido_id) {
    this.id = id;
    this.hoyo = hoyo;
    this.golpes = golpes;
    this.unidades = unidades;
    this.jugador_id;
    this.partido_id;
}