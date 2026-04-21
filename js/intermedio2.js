window.ejercicioIntermedio2 = {
    titulo: "Distribución de Medicamentos en Hospitales",
    dificultad: "Nivel Intermedio",
    
    descripcion: `
        <p>La Secretaría de Salud del Cauca debe decidir <strong>qué centros de distribución abrir</strong> para abastecer hospitales minimizando costos.</p>
        
        <p><strong>Centros:</strong> C1 ($50.000 fijo, 100 und), C2 ($45.000 fijo, 90 und), C3 ($42.000 fijo, 80 und)</p>
        
        <p><strong>Hospitales:</strong> H1 (50 und), H2 (60 und), H3 (40 und)</p>
        
        <p><strong>Restricciones:</strong> Máximo 2 centros abiertos, cubrir demanda, respetar capacidades, presupuesto transporte ≤ $60.000.</p>
    `,

    mostrarDatos() {
        return `
            <div class="item-dato">
                <h4>🏥 Centros</h4>
                <p>C1: $50.000 | 100 und<br>C2: $45.000 | 90 und<br>C3: $42.000 | 80 und</p>
            </div>
            <div class="item-dato">
                <h4>🏨 Demanda Hospitales</h4>
                <p>H1: 50 und<br>H2: 60 und<br>H3: 40 und</p>
            </div>
            <div class="item-dato">
                <h4>⚡ Restricciones</h4>
                <p>Máx 2 centros<br>Transporte ≤ $60.000<br>Cubrir toda demanda</p>
            </div>
        `;
    },

    resolver() {
        const modelo = {
            optimize: "costo_total",
            opType: "min",
            constraints: {
                demanda_H1: { equal: 50 },
                demanda_H2: { equal: 60 },
                demanda_H3: { equal: 40 },
                capacidad_C1: { max: 0 },
                capacidad_C2: { max: 0 },
                capacidad_C3: { max: 0 },
                max_centros: { max: 2 },
                presupuesto: { max: 60000 }
            },
            variables: {
                envio_H1_C1: { demanda_H1: 1, capacidad_C1: 1, presupuesto: 300, costo_total: 300 },
                envio_H1_C2: { demanda_H1: 1, capacidad_C2: 1, presupuesto: 200, costo_total: 200 },
                envio_H1_C3: { demanda_H1: 1, capacidad_C3: 1, presupuesto: 400, costo_total: 400 },
                envio_H2_C1: { demanda_H2: 1, capacidad_C1: 1, presupuesto: 500, costo_total: 500 },
                envio_H2_C2: { demanda_H2: 1, capacidad_C2: 1, presupuesto: 300, costo_total: 300 },
                envio_H2_C3: { demanda_H2: 1, capacidad_C3: 1, presupuesto: 200, costo_total: 200 },
                envio_H3_C1: { demanda_H3: 1, capacidad_C1: 1, presupuesto: 400, costo_total: 400 },
                envio_H3_C2: { demanda_H3: 1, capacidad_C2: 1, presupuesto: 250, costo_total: 250 },
                envio_H3_C3: { demanda_H3: 1, capacidad_C3: 1, presupuesto: 300, costo_total: 300 },
                abrir_C1: { capacidad_C1: -100, max_centros: 1, costo_total: 50000 },
                abrir_C2: { capacidad_C2: -90, max_centros: 1, costo_total: 45000 },
                abrir_C3: { capacidad_C3: -80, max_centros: 1, costo_total: 42000 }
            },
            binaries: {
                abrir_C1: 1,
                abrir_C2: 1,
                abrir_C3: 1
            }
            // Envíos son continuos, solo abrir_C* son binarias
        };

        const resultado = solver.Solve(modelo);

        const envio_H1_C1 = resultado.envio_H1_C1 || 0;
        const envio_H1_C2 = resultado.envio_H1_C2 || 0;
        const envio_H1_C3 = resultado.envio_H1_C3 || 0;
        const envio_H2_C1 = resultado.envio_H2_C1 || 0;
        const envio_H2_C2 = resultado.envio_H2_C2 || 0;
        const envio_H2_C3 = resultado.envio_H2_C3 || 0;
        const envio_H3_C1 = resultado.envio_H3_C1 || 0;
        const envio_H3_C2 = resultado.envio_H3_C2 || 0;
        const envio_H3_C3 = resultado.envio_H3_C3 || 0;

        let tablaHTML = `
            <tr><th></th><th>C1</th><th>C2</th><th>C3</th><th>Total</th></tr>
            <tr><td><strong>H1</strong></td><td>${envio_H1_C1}</td><td>${envio_H1_C2}</td><td>${envio_H1_C3}</td><td>${(envio_H1_C1 + envio_H1_C2 + envio_H1_C3).toFixed(2)}</td></tr>
            <tr><td><strong>H2</strong></td><td>${envio_H2_C1}</td><td>${envio_H2_C2}</td><td>${envio_H2_C3}</td><td>${(envio_H2_C1 + envio_H2_C2 + envio_H2_C3).toFixed(2)}</td></tr>
            <tr><td><strong>H3</strong></td><td>${envio_H3_C1}</td><td>${envio_H3_C2}</td><td>${envio_H3_C3}</td><td>${(envio_H3_C1 + envio_H3_C2 + envio_H3_C3).toFixed(2)}</td></tr>
        `;

        return {
            feasible: resultado.feasible,
            bounded: resultado.bounded,
            estado: resultado.feasible ? 'Optimal' : 'Infeasible',
            objetivo: resultado.result,
            variables: [
                { nombre: "Abrir C1", valor: resultado.abrir_C1 > 0.5 ? "SÍ" : "NO" },
                { nombre: "Abrir C2", valor: resultado.abrir_C2 > 0.5 ? "SÍ" : "NO" },
                { nombre: "Abrir C3", valor: resultado.abrir_C3 > 0.5 ? "SÍ" : "NO" }
            ],
            tablas: [{
                titulo: "Distribución de Medicamentos (unidades)",
                html: tablaHTML
            }]
        };
    }
};