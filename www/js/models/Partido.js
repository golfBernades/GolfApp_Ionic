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
    this.apuestas = {
        agregadas: [],
        find: function (nombre) {
            var encontrada = undefined;

            $.each(this.agregadas, function (index, value) {
                if (value.nombre == nombre) {
                    encontrada = value;
                }
            });

            return encontrada;
        }
    };

    this.registrarGolpes = function (jugadorIndex, hoyoIndex, golpes, unidades) {
        this.scoreBoard[jugadorIndex].golpes[hoyoIndex] = golpes;
        this.scoreBoard[jugadorIndex].unidades[hoyoIndex] = unidades;

        $.each(this.apuestas.agregadas, function (index, value) {
            value.apuesta.actualizar();
        });
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

    this.agregarApuesta = function (nombre, apuesta) {
        this.apuestas.agregadas.push({'nombre': nombre, 'apuesta': apuesta});
    };

    this.createScoreboard();
}
