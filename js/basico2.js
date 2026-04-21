window.ejercicioBasico2 = {
    titulo: "Velas Artesanales y Jabones Naturales",
    dificultad: "Nivel Básico",
    
    descripcion: `
        <p>Una microempresa del Cauca produce semanalmente <strong>velas artesanales decorativas</strong> y <strong>jabones naturales ecológicos</strong>.</p>
        
        <p>Disponibilidad: <strong>160 horas</strong> de trabajo y <strong>80 kg</strong> de materia prima natural.</p>
        
        <p>Cada vela requiere 2 horas y 1 kg. Cada jabón requiere 4 horas y 2 kg. Utilidad: $12.000 por vela y $20.000 por jabón.</p>
        
        <p>Demanda máxima: 50 velas y 30 jabones. Transporte: $200/vela, $400/jabón. Presupuesto transporte: $18.000.</p>
        
        <p><em>¿Cuántas velas y jabones producir para maximizar utilidad?</em></p>
    `,

    mostrarDatos() {
        return `
            <div class="item-dato">
                <h4>🕯️ Vela Artesanal</h4>
                <p>2 hrs | 1 kg materia<br>Utilidad: $12.000<br>Transporte: $200 | Máx: 50</p>
            </div>
            <div class="item-dato">
                <h4>🧼 Jabón Natural</h4>
                <p>4 hrs | 2 kg materia<br>Utilidad: $20.000<br>Transporte: $400 | Máx: 30</p>
            </div>
            <div class="item-dato">
                <h4>⚡ Recursos</h4>
                <p>160 horas semanales<br>80 kg materia prima<br>Presupuesto: $18.000</p>
            </div>
        `;
    },

    resolver() {
        const modelo = {
            optimize: "utilidad",
            opType: "max",
            constraints: {
                horas: { max: 160 },
                materia: { max: 80 },
                max_velas: { max: 50 },
                max_jabones: { max: 30 },
                transporte: { max: 18000 }
            },
            variables: {
                velas: {
                    horas: 2,
                    materia: 1,
                    max_velas: 1,
                    transporte: 200,
                    utilidad: 12000
                },
                jabones: {
                    horas: 4,
                    materia: 2,
                    max_jabones: 1,
                    transporte: 400,
                    utilidad: 20000
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
                { nombre: "Velas a producir", valor: resultado.velas || 0 },
                { nombre: "Jabones a producir", valor: resultado.jabones || 0 }
            ]
        };
    }
};