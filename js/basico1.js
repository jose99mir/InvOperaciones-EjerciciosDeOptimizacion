window.ejercicioBasico1 = {
    titulo: "Producción Artesanal del Cauca",
    dificultad: "Nivel Básico",
    
    descripcion: `
        <p>Una empresa artesanal ubicada en el departamento del Cauca, dedicada a la producción de artículos tradicionales elaborados en mimbre y tejidos manuales, fabrica semanalmente <strong>canastos artesanales</strong> y <strong>mochilas tejidas</strong>.</p>
        
        <p>La empresa dispone de <strong>240 horas semanales</strong> de mano de obra y <strong>120 kg</strong> de materia prima. Cada canasto requiere 4 horas y 2 kg, mientras que cada mochila requiere 6 horas y 3 kg.</p>
        
        <p>La utilidad por canasto es de <strong>$18.000 COP</strong> y por mochila <strong>$25.000 COP</strong>. Se pueden vender máximo 30 canastos y 20 mochilas semanalmente. El transporte cuesta $500 por canasto y $800 por mochila, con presupuesto máximo de $20.000 COP.</p>
        
        <p><em>¿Cuántos canastos y mochilas debe producir para maximizar utilidad?</em></p>
    `,

    mostrarDatos() {
        return `
            <div class="item-dato">
                <h4>🧺 Canasto Artesanal</h4>
                <p>4 hrs trabajo | 2 kg materia<br>Utilidad: $18.000 | Transporte: $500<br>Máx: 30 unidades</p>
            </div>
            <div class="item-dato">
                <h4>🎒 Mochila Tejida</h4>
                <p>6 hrs trabajo | 3 kg materia<br>Utilidad: $25.000 | Transporte: $800<br>Máx: 20 unidades</p>
            </div>
            <div class="item-dato">
                <h4>⚡ Recursos Disponibles</h4>
                <p>240 horas semanales<br>120 kg materia prima<br>Presupuesto transporte: $20.000</p>
            </div>
        `;
    },

    resolver() {
        const modelo = {
            optimize: "utilidad",
            opType: "max",
            constraints: {
                horas: { max: 240 },
                materia: { max: 120 },
                max_canastos: { max: 30 },
                max_mochilas: { max: 20 },
                transporte: { max: 20000 }
            },
            variables: {
                canastos: {
                    horas: 4,
                    materia: 2,
                    max_canastos: 1,
                    transporte: 500,
                    utilidad: 18000
                },
                mochilas: {
                    horas: 6,
                    materia: 3,
                    max_mochilas: 1,
                    transporte: 800,
                    utilidad: 25000
                }
            }
            // Sin 'ints' → variables continuas (LP)
        };

        const resultado = solver.Solve(modelo);

        return {
            feasible: resultado.feasible,
            bounded: resultado.bounded,
            estado: resultado.feasible ? 'Optimal' : 'Infeasible',
            objetivo: resultado.result,
            variables: [
                { nombre: "Canastos a producir", valor: resultado.canastos || 0 },
                { nombre: "Mochilas a producir", valor: resultado.mochilas || 0 }
            ]
        };
    }
};