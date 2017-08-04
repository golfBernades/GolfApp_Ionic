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

    var presionFlag = modoPresiones == 'california' ? 2 : 3;

    /**
     * Agrega dos jugadores que están compitiendo individualmente uno contra
     * el otro en esta apuesta.
     *
     * @param jugador1 Instancia del jugador 1 {index, nombre, handicap}
     * @param jugador2 Instancia del jugador 2 {index, nombre, handicap}
     */
    this.agregarCompeticionIndividual = function (jugador1, jugador2) {
        this.competiciones.push({
            j1: jugador1,
            j2: jugador2,
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
                staticThis.actualizarIndividual(competicion);
            }
        });
    };

    this.actualizarParejas = function (competicion) {
        console.log('ApuestaFoursome.actualizarParejas',
            competicion.p1_j1.nombre + ' Y ' + competicion.p1_j2.nombre
            + ' VS ' + competicion.p2_j1.nombre + ' Y '
            + competicion.p2_j2.nombre);

        for (var hIndex = 0; hIndex < 18; hIndex++) {
            if (verificarHoyoTerminadoParejas(competicion, hIndex)) {
                var jugsGolpes = obtenerGolpesParejas(competicion, hIndex);
                calcularFoursomeParejas(competicion, jugsGolpes, hIndex);
            }
        }
    };

    function verificarHoyoTerminadoParejas(competicion, hIndex) {
        // console.log('ApuestaFoursome.verificarHoyoTerminadoParejas',
        //     competicion + ', ' + (hIndex + 1));

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
        // console.log('ApuestaFoursome.obtenerGolpesParejas', competicion + ', '
        //     + (hIndex + 1));

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

        console.log('P1_handicap', p1_handicap);
        console.log('P2_handicap', p2_handicap);

        var diferenciaP1P2 = p1_handicap - p2_handicap;
        var diferenciaP2P1 = p2_handicap - p1_handicap;
        var vents = 0;

        if (diferenciaP1P2 >= ventajaHoyo) {
            if (diferenciaP1P2 > 18) {
                vents = 1;
                while (diferenciaP1P2 - 18 >= ventajaHoyo) {
                    vents++;
                    diferenciaP1P2 -= 18;
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
            } else {
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

    function calcularFoursomeParejas(competicion, jugsGolpes, hIndex) {
        // console.log('ApuestaFoursome.calcularFoursomeParejas', competicion + ', '
        //     + jugsGolpes + ', ' + (hIndex + 1));

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

        console.log('Comparación hoyo ' + (hIndex + 1), 'p1_bola_alta: '
            + p1_bola_alta + ', p2_bola_alta: ' + p2_bola_alta);
        console.log('Comparación hoyo ' + (hIndex + 1), 'p1_bola_baja: '
            + p1_bola_baja + ', p2_bola_baja: ' + p2_bola_baja);

        compararGolpesPareja(competicion, p1_bola_baja, p2_bola_baja, hIndex, true);
        compararGolpesPareja(competicion, p1_bola_alta, p2_bola_alta, hIndex, false);
    }

    function compararGolpesPareja(competicion, p1_golpes, p2_golpes, hIndex, isPrimerJugador) {
        // console.log('ApuestaFoursome.compararGolpesPareja',
        //     'P1_golpes: ' + p1_golpes + ', P2_golpes: ' + p2_golpes + ', Hoyo: '
        //     + (hIndex + 1) + ', PrimerJugador: ' + isPrimerJugador);
        var compAnterior = hIndex > 0 ? competicion.puntuaciones[hIndex - 1] : undefined;
        var compActual = competicion.puntuaciones[hIndex];
        var ultimaPuntuacion;
        var i;

        if (p1_golpes < p2_golpes) {
            if ((hIndex > 0 && hIndex < 9) || hIndex > 9 && hIndex < 18) {
                for (i = 0; i < compAnterior.length; i++) {
                    if (compActual[i] == undefined) {
                        compActual.push(compAnterior[i]);
                    }
                    compActual[i] += 1;
                }

                if (!isPrimerJugador) {
                    ultimaPuntuacion = compActual[compActual.length - 1];

                    if (ultimaPuntuacion >= presionFlag || ultimaPuntuacion <= -presionFlag) {
                        console.log('Se agregará otra presión en hoyo ' + (hIndex + 1));
                        compActual.push(0);
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
            if ((hIndex > 0 && hIndex < 9) || hIndex > 9 && hIndex < 18) {
                for (i = 0; i < compAnterior.length; i++) {
                    if (compActual[i] == undefined) {
                        compActual.push(compAnterior[i]);
                    }
                    compActual[i] -= 1;
                }

                if (!isPrimerJugador) {
                    ultimaPuntuacion = compActual[compActual.length - 1];

                    if (ultimaPuntuacion >= presionFlag || ultimaPuntuacion <= -presionFlag) {
                        console.log('Se agregará otra presión en hoyo ' + (hIndex + 1));
                        compActual.push(0);
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
            if ((hIndex > 0 && hIndex < 9) || hIndex > 9 && hIndex < 18) {
                if (compActual[0] == undefined) {
                    for (i = 0; i < compAnterior.length; i++) {
                        compActual.push(compAnterior[i]);
                    }
                }
            } else if (compActual[0] == undefined) {
                compActual.push(0);
            }
        }
    }

    this.actualizarIndividual = function (competicion) {
        for (var hIndex = 0; hIndex < 18; hIndex++) {
            if (verificarHoyoTerminadoIndividual(competicion, hIndex)) {
                var jugsGolpes = obtenerGolpesIndividual(competicion, hIndex);
                calcularFoursomeIndividual(competicion, jugsGolpes, hIndex);
            }
        }
    };

    function verificarHoyoTerminadoIndividual(competicion, hIndex) {
        var indexJ1 = competicion.j1.idx;
        var golpesJ1 = staticThis.partido.scoreBoard[indexJ1].golpes[hIndex];
        var indexJ2 = competicion.j2.idx;
        var golpesJ2 = staticThis.partido.scoreBoard[indexJ2].golpes[hIndex];

        return golpesJ1 && golpesJ2;
    }

    function obtenerGolpesIndividual(competicion, hIndex) {
        var j1_idx = competicion.j1.idx;
        var j2_idx = competicion.j2.idx;
        var j1_golpes = staticThis.partido.scoreBoard[j1_idx].golpes[hIndex];
        var j2_golpes = staticThis.partido.scoreBoard[j2_idx].golpes[hIndex];
        var j1_handicap = competicion.j1.handicap;
        var j2_handicap = competicion.j2.handicap;
        var ventajaHoyo = staticThis.partido.campo.ventajas[hIndex].value;

        var diferenciaJ1J2 = j1_handicap - j2_handicap;
        var diferenciaJ2J1 = j2_handicap - j1_handicap;
        var vents = 0;

        if (diferenciaJ1J2 >= ventajaHoyo) {
            if (diferenciaJ1J2 > 18) {
                vents = 1;
                while (diferenciaJ1J2 - 18 >= ventajaHoyo) {
                    vents++;
                    diferenciaJ1J2 -= 18;
                }
                j1_golpes -= vents;
            } else {
                j1_golpes--;
            }
        } else if (diferenciaJ2J1 >= ventajaHoyo) {
            if (diferenciaJ2J1 > 18) {
                vents = 1;
                while (diferenciaJ2J1 - 18 >= ventajaHoyo) {
                    vents++;
                    diferenciaJ2J1 -= 18;
                }
                j2_golpes -= vents;
            } else {
                j2_golpes--;
            }
        }

        return {
            j1: {
                idx: j1_handicap,
                golpes: j1_golpes
            },
            j2: {
                idx: j2_idx,
                golpes: j2_golpes
            }
        }
    }

    function calcularFoursomeIndividual(competicion, jugsGolpes, hIndex) {
        var j1_golpes = jugsGolpes.j1.golpes;
        var j2_golpes = jugsGolpes.j2.golpes;

        var compAnterior = hIndex > 0 ? competicion.puntuaciones[hIndex - 1] : undefined;
        var compActual = competicion.puntuaciones[hIndex];
        var ultimaPuntuacion;
        var i;

        if (j1_golpes < j2_golpes) {
            if ((hIndex > 0 && hIndex < 9) || hIndex > 9 && hIndex < 18) {
                for (i = 0; i < compAnterior.length; i++) {
                    compActual.push(compAnterior[i]);
                    compActual[i] += 1;
                }

                ultimaPuntuacion = compActual[compActual.length - 1];

                if (ultimaPuntuacion >= presionFlag || ultimaPuntuacion <= -presionFlag) {
                    console.log('Se agregará otra presión en hoyo ' + (hIndex + 1));
                    compActual.push(0);
                }
            } else {
                compActual.push(1);
            }
        } else if (j2_golpes < j1_golpes) {
            if ((hIndex > 0 && hIndex < 9) || hIndex > 9 && hIndex < 18) {
                for (i = 0; i < compAnterior.length; i++) {
                    compActual.push(compAnterior[i]);
                    compActual[i] -= 1;
                }

                ultimaPuntuacion = compActual[compActual.length - 1];

                if (ultimaPuntuacion >= presionFlag || ultimaPuntuacion <= -presionFlag) {
                    console.log('Se agregará otra presión en hoyo ' + (hIndex + 1));
                    compActual.push(0);
                }
            } else {
                compActual.push(-1);
            }
        } else {
            if ((hIndex > 0 && hIndex < 9) || hIndex > 9 && hIndex < 18) {
                for (i = 0; i < compAnterior.length; i++) {
                    compActual.push(compAnterior[i]);
                }
            } else {
                compActual.push(0);
            }
        }
    }
}