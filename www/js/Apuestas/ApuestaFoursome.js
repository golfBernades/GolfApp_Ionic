/**
 * Esta función crea una instancia de un objeto de tipo ApuestaFoursome, que es
 * el gestor de las puntuaciones para un partido donde se está jugando esta
 * modalidad.
 *
 * @param partido Es la instancia del Partido donde se está implementando
 * esta Apuesta.
 * @param modalidad Determina si la apuesta se llevara en parejas o de forma
 * individual. Las modalidades pueden ser:
 *
 * individual_normal
 * individual_california
 * pareja_normal
 * pareja_california
 *
 * @author Porfirio Ángel Díaz Sánchez
 */
function ApuestaFoursome(partido, modoJugadores, modoPresiones) {
    this.partido = partido;
    this.competiciones = [];

    var staticThis = this;

    /**
     * Agrega dos jugadores que están compitiendo individualmente uno contra
     * el otro en esta apuesta.
     *
     * @param jugador1 Instancia del jugador 1 {index, nombre, handicap}
     * @param jugador2 Instancia del jugador 2 {index, nombre, handicap}
     */
    this.agregarCompeticionIndividual = function (jugador1, jugador2) {
        this.competiciones.push({
            jugador1: jugador1,
            jugador2: jugador2,
            puntuaciones: [
                [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
                [], []
            ]
        });
    };

    /**
     * Agrega dos parejas que están compitiendo una contra la otra en esta
     * apuesta.
     *
     * @param p1Jugador1 Instancia del jugador 1 de la pareja 1
     * {index, nombre, handicap}
     * @param p1Jugador2 Instancia del jugador 2 de la pareja 1
     * {index, nombre, handicap}
     * @param p1Ventaja Es el índice que indica cual jugador de la pareja 1
     * llevará la ventaja (1 o 2).
     * @param p2Jugador1 Instancia del jugador 1 de la pareja 2
     * {index, nombre, handicap}
     * @param p2Jugador2 Instancia del jugador 2 de la pareja 2
     * {index, nombre, handicap}
     * @param p2Ventaja Es el índice que indica cual jugador de la pareja 2
     * llevará la ventaja (1 o 2).
     */
    this.agregarCompeticionPareja = function (p1Jugador1, p1Jugador2, p1Ventaja,
                                              p2Jugador1, p2Jugador2, p2Ventaja) {
        this.competiciones.push({
            p1_j1: p1Jugador1,
            p1_j2: p1Jugador2,
            p1_ventaja: p1Ventaja,
            p2_j1: p2Jugador1,
            p2_j2: p2Jugador2,
            p2_ventaja: p2Ventaja,
            puntuaciones: [
                [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
                [], []
            ]
        });
    };

    this.resetScoreboard = function () {
        $.each(this.competiciones, function (index, value) {
            value.puntuaciones = [
                [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
                [], []
            ];
        });
    };

    this.actualizar = function () {
        console.log('GolfApp', 'ApuestaFoursome.actualizar()');
        this.resetScoreboard();

        $.each(this.competiciones, function (index, competicion) {
            if (modoJugadores == 'pareja') {
                staticThis.actualizarParejas(competicion);
            } else if (modoJugadores == 'individual') {
                // staticThis.actualizarIndividual(competicion);
            }
        });
    };

    this.actualizarParejas = function (competicion) {
        console.log('ApuestaFoursome.actualizarParejas', competicion);

        for (var hIndex = 0; hIndex < 18; hIndex++) {
            if (verificarHoyoTerminadoParejas(competicion, hIndex)) {
                var jugsGolpes = obtenerGolpesParejas(competicion, hIndex);
                calcularFoursome(competicion, jugsGolpes, hIndex);
            }
        }
    };

    function verificarHoyoTerminadoParejas(competicion, hIndex) {
        console.log('ApuestaFoursome.verificarHoyoTerminadoParejas',
            competicion + ', ' + (hIndex + 1));

        var indexP1J1 = competicion.p1_j1.idx;
        var golpesP1J1 = staticThis.partido.scoreBoard[indexP1J1].golpes[hIndex];
        var indexP1J2 = competicion.p1_j2.idx;
        var golpesP1J2 = staticThis.partido.scoreBoard[indexP1J2].golpes[hIndex];
        var indexP2J1 = competicion.p2_j1.idx;
        var golpesP2J1 = staticThis.partido.scoreBoard[indexP2J1].golpes[hIndex];
        var indexP2J2 = competicion.p2_j2.idx;
        var golpesP2J2 = staticThis.partido.scoreBoard[indexP2J2].golpes[hIndex];

        return golpesP1J1 && golpesP1J2 && golpesP2J1 && golpesP2J2;
    }

    function obtenerGolpesParejas(competicion, hIndex) {
        console.log('ApuestaFoursome.obtenerGolpesParejas', competicion + ', '
            + (hIndex + 1));

        var p1_j1_idx = competicion.p1_j1.idx;
        var p1_j2_idx = competicion.p1_j2.idx;
        var p2_j1_idx = competicion.p2_j1.idx;
        var p2_j2_idx = competicion.p2_j2.idx;
        var p1_j1_golpes = staticThis.partido.scoreBoard[p1_j1_idx].golpes[hIndex];
        var p1_j2_golpes = staticThis.partido.scoreBoard[p1_j2_idx].golpes[hIndex];
        var p2_j1_golpes = staticThis.partido.scoreBoard[p2_j1_idx].golpes[hIndex];
        var p2_j2_golpes = staticThis.partido.scoreBoard[p2_j2_idx].golpes[hIndex];
        var p1_j1_handicap = competicion.p1_j1.handicap;
        var p1_j2_handicap = competicion.p1_j2.handicap;
        var p2_j1_handicap = competicion.p2_j1.handicap;
        var p2_j2_handicap = competicion.p2_j2.handicap;
        var p1_handicap = p1_j1_handicap + p1_j2_handicap;
        var p2_handicap = p2_j1_handicap + p2_j2_handicap;
        var p1_ventaja = competicion.p1_ventaja;
        var p2_ventaja = competicion.p2_ventaja;
        var ventajaHoyo = staticThis.partido.campo.ventajas[hIndex].value;

        var diferenciaP1P1 = p1_handicap - p2_handicap;
        var diferenciaP2P1 = p2_handicap - p1_handicap;
        var vents = 0;

        if (diferenciaP1P1 >= ventajaHoyo) {
            if (diferenciaP1P1 > 18) {
                vents = 1;
                while (diferenciaP1P1 - 18 >= ventajaHoyo) {
                    vents++;
                    diferenciaP1P1 -= 18;
                }
                if (p1_ventaja == 1) p1_j1_golpes -= vents;
                else if (p1_ventaja == 2) p1_j2_golpes -= vents;
            } else {
                if (p1_ventaja == 1) p1_j1_golpes--;
                else if (p1_ventaja == 2) p1_j2_golpes--;
            }
        } else if (diferenciaP2P1 >= ventajaHoyo) {
            if (diferenciaP2P1 > 18) {
                vents = 1;
                while (diferenciaP2P1 - 18 >= ventajaHoyo) {
                    vents++;
                    diferenciaP2P1 -= 18;
                }
                if (p2_ventaja == 1) p2_j1_golpes -= vents;
                else if (p2_ventaja == 2) p2_j2_golpes -= vents;
            }
            else {
                if (p2_ventaja == 1) p2_j1_golpes--;
                else if (p2_ventaja == 2) p2_j2_golpes--;
            }
        }

        return {
            p1_j1: {
                idx: p1_j1_idx,
                golpes: p1_j1_golpes
            },
            p1_j2: {
                idx: p1_j2_idx,
                golpes: p1_j2_golpes
            },
            p2_j1: {
                idx: p2_j1_idx,
                golpes: p2_j1_golpes
            },
            p2_j2: {
                idx: p2_j2_idx,
                golpes: p2_j2_golpes
            }
        }
    }

    function calcularFoursome(competicion, jugsGolpes, hIndex) {
        console.log('ApuestaFoursome.calcularFoursome', competicion + ', '
            + jugsGolpes + ', ' + (hIndex + 1));

        var p1_j1_golpes = jugsGolpes.p1_j1.golpes;
        var p1_j2_golpes = jugsGolpes.p1_j2.golpes;
        var p2_j1_golpes = jugsGolpes.p2_j1.golpes;
        var p2_j2_golpes = jugsGolpes.p2_j2.golpes;

        var p1_bola_alta;
        var p1_bola_baja;
        var p2_bola_alta;
        var p2_bola_baja;

        if (p1_j1_golpes > p1_j2_golpes) {
            p1_bola_alta = p1_j1_golpes;
            p1_bola_baja = p1_j2_golpes;
        } else {
            p1_bola_alta = p1_j2_golpes;
            p1_bola_baja = p1_j1_golpes;
        }

        if (p2_j1_golpes > p2_j2_golpes) {
            p2_bola_alta = p2_j1_golpes;
            p2_bola_baja = p2_j2_golpes;
        } else {
            p2_bola_alta = p2_j2_golpes;
            p2_bola_baja = p2_j1_golpes;
        }

        compararGolpesPareja(competicion, p1_bola_baja, p2_bola_baja, hIndex, false);
        compararGolpesPareja(competicion, p1_bola_alta, p2_bola_alta, hIndex, true);
    }

    function compararGolpesPareja(competicion, p1_golpes, p2_golpes, hIndex, isPrimerJugador) {
        var compAnterior = hIndex > 0 ? competicion.puntuaciones[hIndex - 1] : undefined;
        var compActual = competicion.puntuaciones[hIndex];
        var ultimaPuntuacion;
        var i;

        if (p1_golpes < p2_golpes) {
            if (hIndex > 0) {
                for (i = 0; i < compAnterior.length; i++) {
                    if (compActual[i] == undefined) {
                        compActual.push(compAnterior[i]);
                    }
                    compActual[i] += 1;
                }

                if (!isPrimerJugador) {
                    ultimaPuntuacion = compActual[compActual.length - 1];

                    if (ultimaPuntuacion == 3 || ultimaPuntuacion == -3) {
                        console.log('Se agregará otra presión')
                    }
                }
            } else {
                if (compActual[0] == undefined) {
                    compActual.push(1);
                } else {
                    compActual[0] += 1;
                }
            }
        } else if (p2_golpes < p1_golpes) {
            if (hIndex > 0) {
                for (i = 0; i < compAnterior.length; i++) {
                    if (compActual[i] == undefined) {
                        compActual.push(compAnterior[i]);
                    }
                    compActual[i] -= 1;
                }

                if (!isPrimerJugador) {
                    ultimaPuntuacion = compActual[compActual.length - 1];

                    if (ultimaPuntuacion == 3 || ultimaPuntuacion == -3) {
                        console.log('Se agregará otra presión')
                    }
                }
            } else {
                if (compActual[0] == undefined) {
                    compActual.push(-1);
                } else {
                    compActual[0] -= 1;
                }
            }
        } else {
            if (hIndex > 0) {
                if (compActual[0] == undefined) {
                    for (i = 0; i < compAnterior.length; i++) {
                        compActual.push(compAnterior[i]);
                    }
                }
            } else if (compActual[0] == undefined) {
                compActual.push(0);
            }
        }
        // if (golpesJ1 < golpesJ2) {
        //     if (hIndex > 0) {
        //         var compAnterior = competicion.puntuaciones[hIndex - 1];
        //         var compActual = competicion.puntuaciones[hIndex];
        //
        //         for (var i = 0; i < compAnterior.length; i++) {
        //             compActual.push(compAnterior[i] + 1);
        //         }
        //
        //         var ultimaPuntuacion = compActual[compActual.length - 1];
        //
        //         if (ultimaPuntuacion == 3 || ultimaPuntuacion == -3) {
        //             console.log('Se agregará otra puntuación')
        //         }
        //     } else {
        //         competicion.puntuaciones[hIndex].push(1);
        //     }
        // } else if (golpesI > golpesJ) {
        //     if (hIndex > 0) {
        //         var compAnterior = competicion.puntuaciones[hIndex - 1];
        //         var compActual = competicion.puntuaciones[hIndex];
        //
        //         for (var i = 0; i < compAnterior.length; i++) {
        //             compActual.push(compAnterior[i] - 1);
        //         }
        //
        //         var ultimaPuntuacion = compActual[compActual.length - 1];
        //
        //         if (ultimaPuntuacion == 3 || ultimaPuntuacion == -3) {
        //             console.log('Se agregará otra puntuación')
        //         }
        //     } else {
        //         competicion.puntuaciones[hIndex].push(-1);
        //     }
        // } else {
        //     if (hIndex > 0) {
        //         var compAnterior = competicion.puntuaciones[hIndex - 1];
        //         var compActual = competicion.puntuaciones[hIndex];
        //
        //         for (var i = 0; i < compAnterior.length; i++) {
        //             compActual.push(compAnterior[i]);
        //         }
        //     } else {
        //         competicion.puntuaciones[hIndex].push(0);
        //     }
        // }
    }
}