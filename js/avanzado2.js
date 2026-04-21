window.ejercicioAvanzado2 = {
    titulo: "Capacitated Lot Sizing Problem (CLSP)",
    dificultad: "Nivel Avanzado",
    
    descripcion: `
        <p>Problema de planificación de producción donde una empresa manufacturera debe determinar las <strong>cantidades óptimas a producir</strong> de múltiples productos a lo largo de varios periodos.</p>
        
        <p>Cada producto tiene demanda conocida, costos de producción y almacenamiento. La capacidad de producción es limitada por periodo.</p>
        
        <p><strong>Balance de inventario:</strong> I<sub>i,t</sub> = I<sub>i,t-1</sub> + x<sub>i,t</sub> - D<sub>i,t</sub></p>
        
        <p>Objetivo: <strong>Minimizar costos de producción + almacenamiento</strong>.</p>
    `,

    mostrarDatos() {
        return `
            <div class="item-dato">
                <h4>📦 Productos</h4>
                <p>Producto 1: Costo $15 | Inv $2<br>Producto 2: Costo $25 | Inv $3</p>
            </div>
            <div class="item-dato">
                <h4>📅 Periodos (4)</h4>
                <p>P1: Prod1=50, Prod2=20<br>P2: Prod1=30, Prod2=40<br>P3: Prod1=40, Prod2=30<br>P4: Prod1=60, Prod2=10</p>
            </div>
            <div class="item-dato">
                <h4>⚡ Capacidad</h4>
                <p>100 unidades por periodo<br>Sin faltantes permitidos<br>Inventario inicial = 0</p>
            </div>
        `;
    },

    resolver() {
        const modelo = {
            optimize: "costo_total",
            opType: "min",
            constraints: {
                balance_1_1: { equal: 50 },
                balance_1_2: { equal: 30 },
                balance_1_3: { equal: 40 },
                balance_1_4: { equal: 60 },
                balance_2_1: { equal: 20 },
                balance_2_2: { equal: 40 },
                balance_2_3: { equal: 30 },
                balance_2_4: { equal: 10 },
                capacidad_1: { max: 100 },
                capacidad_2: { max: 100 },
                capacidad_3: { max: 100 },
                capacidad_4: { max: 100 }
            },
            variables: {
                Prod_1_1: { balance_1_1: 1, capacidad_1: 1, costo_total: 15 },
                Prod_1_2: { balance_1_2: 1, capacidad_2: 1, costo_total: 15 },
                Prod_1_3: { balance_1_3: 1, capacidad_3: 1, costo_total: 15 },
                Prod_1_4: { balance_1_4: 1, capacidad_4: 1, costo_total: 15 },
                Prod_2_1: { balance_2_1: 1, capacidad_1: 1, costo_total: 25 },
                Prod_2_2: { balance_2_2: 1, capacidad_2: 1, costo_total: 25 },
                Prod_2_3: { balance_2_3: 1, capacidad_3: 1, costo_total: 25 },
                Prod_2_4: { balance_2_4: 1, capacidad_4: 1, costo_total: 25 },
                Inv_1_1: { balance_1_1: -1, balance_1_2: 1, costo_total: 2 },
                Inv_1_2: { balance_1_2: -1, balance_1_3: 1, costo_total: 2 },
                Inv_1_3: { balance_1_3: -1, balance_1_4: 1, costo_total: 2 },
                Inv_1_4: { balance_1_4: -1, costo_total: 2 },
                Inv_2_1: { balance_2_1: -1, balance_2_2: 1, costo_total: 3 },
                Inv_2_2: { balance_2_2: -1, balance_2_3: 1, costo_total: 3 },
                Inv_2_3: { balance_2_3: -1, balance_2_4: 1, costo_total: 3 },
                Inv_2_4: { balance_2_4: -1, costo_total: 3 }
            }
            // Sin 'ints' → variables continuas (LP)
        };

        const resultado = solver.Solve(modelo);

        const prod_1_1 = resultado.Prod_1_1 || 0;
        const prod_1_2 = resultado.Prod_1_2 || 0;
        const prod_1_3 = resultado.Prod_1_3 || 0;
        const prod_1_4 = resultado.Prod_1_4 || 0;
        const prod_2_1 = resultado.Prod_2_1 || 0;
        const prod_2_2 = resultado.Prod_2_2 || 0;
        const prod_2_3 = resultado.Prod_2_3 || 0;
        const prod_2_4 = resultado.Prod_2_4 || 0;
        
        const inv_1_1 = resultado.Inv_1_1 || 0;
        const inv_1_2 = resultado.Inv_1_2 || 0;
        const inv_1_3 = resultado.Inv_1_3 || 0;
        const inv_1_4 = resultado.Inv_1_4 || 0;
        const inv_2_1 = resultado.Inv_2_1 || 0;
        const inv_2_2 = resultado.Inv_2_2 || 0;
        const inv_2_3 = resultado.Inv_2_3 || 0;
        const inv_2_4 = resultado.Inv_2_4 || 0;

        let tablaHTML = `
            <tr><th>Periodo</th><th>Producto 1</th><th>Inventario 1</th><th>Producto 2</th><th>Inventario 2</th><th>Capacidad Usada</th></tr>
            <tr><td><strong>1</strong></td><td>${prod_1_1}</td><td>${inv_1_1}</td><td>${prod_2_1}</td><td>${inv_2_1}</td><td>${(prod_1_1 + prod_2_1).toFixed(2)}/100</td></tr>
            <tr><td><strong>2</strong></td><td>${prod_1_2}</td><td>${inv_1_2}</td><td>${prod_2_2}</td><td>${inv_2_2}</td><td>${(prod_1_2 + prod_2_2).toFixed(2)}/100</td></tr>
            <tr><td><strong>3</strong></td><td>${prod_1_3}</td><td>${inv_1_3}</td><td>${prod_2_3}</td><td>${inv_2_3}</td><td>${(prod_1_3 + prod_2_3).toFixed(2)}/100</td></tr>
            <tr><td><strong>4</strong></td><td>${prod_1_4}</td><td>${inv_1_4}</td><td>${prod_2_4}</td><td>${inv_2_4}</td><td>${(prod_1_4 + prod_2_4).toFixed(2)}/100</td></tr>
        `;

        return {
            feasible: resultado.feasible,
            bounded: resultado.bounded,
            estado: resultado.feasible ? 'Optimal' : 'Infeasible',
            objetivo: resultado.result,
            variables: [
                { nombre: "Producción Total Producto 1", valor: (prod_1_1 + prod_1_2 + prod_1_3 + prod_1_4).toFixed(2) },
                { nombre: "Producción Total Producto 2", valor: (prod_2_1 + prod_2_2 + prod_2_3 + prod_2_4).toFixed(2) }
            ],
            tablas: [{
                titulo: "Plan de Producción por Periodo",
                html: tablaHTML
            }]
        };
    }
};