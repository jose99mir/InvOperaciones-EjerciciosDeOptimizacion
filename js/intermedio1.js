window.ejercicioIntermedio1 = {
    titulo: "Ubicación de Bodegas de Alimentos",
    dificultad: "Nivel Intermedio",
    
    descripcion: `
        <p>Una distribuidora de alimentos del Cauca debe decidir <strong>qué bodegas abrir</strong> para abastecer 3 municipios minimizando costos logísticos.</p>
        
        <p><strong>Bodegas candidatas:</strong> B1 ($40.000 fijo, 80 ton), B2 ($35.000 fijo, 70 ton), B3 ($30.000 fijo, 60 ton)</p>
        
        <p><strong>Municipios:</strong> M1 (40 ton), M2 (50 ton), M3 (30 ton)</p>
        
        <p><strong>Restricciones:</strong> Máximo 2 bodegas abiertas, satisfacer toda la demanda, respetar capacidades, máximo 120 ton por vía Panamericana.</p>
    `,

    mostrarDatos() {
        return `
            <div class="item-dato">
                <h4>🏭 Bodegas</h4>
                <p>B1: $40.000 | 80 ton<br>B2: $35.000 | 70 ton<br>B3: $30.000 | 60 ton</p>
            </div>
            <div class="item-dato">
                <h4>🏘️ Demanda Municipios</h4>
                <p>M1: 40 ton<br>M2: 50 ton<br>M3: 30 ton</p>
            </div>
            <div class="item-dato">
                <h4>⚡ Restricciones</h4>
                <p>Máx 2 bodegas abiertas<br>Capacidad respetada<br>Máx 120 ton transporte</p>
            </div>
        `;
    },

    resolver() {
        const modelo = {
            optimize: "costo_total",
            opType: "min",
            constraints: {
                demanda_M1: { equal: 40 },
                demanda_M2: { equal: 50 },
                demanda_M3: { equal: 30 },
                capacidad_B1: { max: 0 },
                capacidad_B2: { max: 0 },
                capacidad_B3: { max: 0 },
                max_bodegas: { max: 2 },
                panamericana: { max: 120 }
            },
            variables: {
                envio_M1_B1: { demanda_M1: 1, capacidad_B1: 1, panamericana: 1, costo_total: 400 },
                envio_M1_B2: { demanda_M1: 1, capacidad_B2: 1, panamericana: 1, costo_total: 500 },
                envio_M1_B3: { demanda_M1: 1, capacidad_B3: 1, panamericana: 1, costo_total: 600 },
                envio_M2_B1: { demanda_M2: 1, capacidad_B1: 1, panamericana: 1, costo_total: 300 },
                envio_M2_B2: { demanda_M2: 1, capacidad_B2: 1, panamericana: 1, costo_total: 400 },
                envio_M2_B3: { demanda_M2: 1, capacidad_B3: 1, panamericana: 1, costo_total: 500 },
                envio_M3_B1: { demanda_M3: 1, capacidad_B1: 1, panamericana: 1, costo_total: 200 },
                envio_M3_B2: { demanda_M3: 1, capacidad_B2: 1, panamericana: 1, costo_total: 300 },
                envio_M3_B3: { demanda_M3: 1, capacidad_B3: 1, panamericana: 1, costo_total: 400 },
                abrir_B1: { capacidad_B1: -80, max_bodegas: 1, costo_total: 40000 },
                abrir_B2: { capacidad_B2: -70, max_bodegas: 1, costo_total: 35000 },
                abrir_B3: { capacidad_B3: -60, max_bodegas: 1, costo_total: 30000 }
            },
            binaries: {
                abrir_B1: 1,
                abrir_B2: 1,
                abrir_B3: 1
            }
            // Envíos son continuos, solo abrir_B* son binarias
        };

        const resultado = solver.Solve(modelo);

        const envio_M1_B1 = resultado.envio_M1_B1 || 0;
        const envio_M1_B2 = resultado.envio_M1_B2 || 0;
        const envio_M1_B3 = resultado.envio_M1_B3 || 0;
        const envio_M2_B1 = resultado.envio_M2_B1 || 0;
        const envio_M2_B2 = resultado.envio_M2_B2 || 0;
        const envio_M2_B3 = resultado.envio_M2_B3 || 0;
        const envio_M3_B1 = resultado.envio_M3_B1 || 0;
        const envio_M3_B2 = resultado.envio_M3_B2 || 0;
        const envio_M3_B3 = resultado.envio_M3_B3 || 0;

        let tablaHTML = `
            <tr><th></th><th>B1</th><th>B2</th><th>B3</th><th>Total</th></tr>
            <tr><td><strong>M1</strong></td><td>${envio_M1_B1}</td><td>${envio_M1_B2}</td><td>${envio_M1_B3}</td><td>${(envio_M1_B1 + envio_M1_B2 + envio_M1_B3).toFixed(2)}</td></tr>
            <tr><td><strong>M2</strong></td><td>${envio_M2_B1}</td><td>${envio_M2_B2}</td><td>${envio_M2_B3}</td><td>${(envio_M2_B1 + envio_M2_B2 + envio_M2_B3).toFixed(2)}</td></tr>
            <tr><td><strong>M3</strong></td><td>${envio_M3_B1}</td><td>${envio_M3_B2}</td><td>${envio_M3_B3}</td><td>${(envio_M3_B1 + envio_M3_B2 + envio_M3_B3).toFixed(2)}</td></tr>
        `;

        return {
            feasible: resultado.feasible,
            bounded: resultado.bounded,
            estado: resultado.feasible ? 'Optimal' : 'Infeasible',
            objetivo: resultado.result,
            variables: [
                { nombre: "Abrir B1", valor: resultado.abrir_B1 > 0.5 ? "SÍ" : "NO" },
                { nombre: "Abrir B2", valor: resultado.abrir_B2 > 0.5 ? "SÍ" : "NO" },
                { nombre: "Abrir B3", valor: resultado.abrir_B3 > 0.5 ? "SÍ" : "NO" }
            ],
            tablas: [{
                titulo: "Distribución de Envíos (toneladas)",
                html: tablaHTML
            }]
        };
    }
};