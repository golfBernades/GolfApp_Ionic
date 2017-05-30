/**
 * Esta función crea una instancia de un objeto de tipo Partido, con el cual
 * se administra el scoreBoard de un Partido de golf.
 *
 * @param jugadores Es un arreglo de elementos de tipo Jugador que contiene
 * las instancias de los jugadores que participan en el Partido.
 * @param campo Es una instancia de Campo que representa el Campo donde se
 * está llevando a cabo el Partido.
 *
 * @author Porfirio Ángel Díaz Sánchez
 */
function Partido(jugadores, campo) {

    this.jugadores = jugadores;
    this.campo = campo;
    this.scoreBoard = [];
    this.apuestas = [];

    this.registrarGolpes = function (jugadorIndex, hoyoIndex, golpes, unidades) {
        this.scoreBoard[jugadorIndex].golpes[hoyoIndex] = golpes;
        this.scoreBoard[jugadorIndex].unidades[hoyoIndex] = unidades;
        if (jugadorIndex == this.scoreBoard.length - 1) {
            this.apuestas.forEach(function (apuesta) {
                apuesta.actualizar(jugadorIndex, hoyoIndex);
            });
        }
    };

    this.createScoreboard = function () {
        var numJugadores = this.jugadores.length;
        var numHoyos = this.campo.pares.length;
        for (var i = 0; i < numJugadores; i++) {
            this.scoreBoard.push({golpes: [], unidades: []});
            for (var j = 0; j < numHoyos; j++) {
                this.scoreBoard[i].golpes.push(0);
                this.scoreBoard[i].unidades.push(0);
            }
        }
    };

    this.agregarApuesta = function (apuesta) {
        this.apuestas.push(apuesta);
    };

    this.createScoreboard();
}
