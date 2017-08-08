/**
 * Modelo de la tabla jugador.
 *
 * @param id
 * @param nombre
 * @param apodo
 * @param handicap
 * @param sexo
 * @param url_foto
 * @param password
 * @param email
 */
function Jugador(id, nombre, apodo, handicap, jugar, sexo, url_foto, password, email) {
    this.id = id;
    this.nombre = nombre;
    this.apodo = apodo;
    this.handicap = handicap;
    this.jugar = jugar;
    this.sexo = sexo;
    this.url_foto = url_foto;
    this.password = password;
    this.email = email;
}
