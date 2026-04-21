window.ejercicioAvanzado1 = {
    titulo: "Planeación Multiperíodo Tecnología PDET",
    dificultad: "Nivel Avanzado",
    
    descripcion: `
        <p>Empresa tecnológica del Cauca debe planificar durante <strong>3 meses</strong> la distribución de equipos educativos digitales (tablets y routers) hacia 3 municipios PDET.</p>
        
        <p>Los equipos se compran a <strong>2 proveedores</strong> con diferentes costos y capacidades mensuales. Se debe garantizar demanda mensual, capacidad de proveedor, control de inventario, presupuesto mensual.</p>
        
        <p><strong>Restricción lógica:</strong> Si se compra router, también debe comprarse tablet del mismo proveedor (compatibilidad educativa).</p>
        
        <p><strong>Datos del problema:</strong></p>
        <ul>
            <li>Costo compra: $500 por unidad</li>
            <li>Costo inventario: $10 por unidad/mes</li>
            <li>Capacidad proveedor: 500 unidades/mes</li>
            <li>Presupuesto mensual: $50.000</li>
            <li>Demanda: 100 unidades por municipio/mes (3 municipios = 300 und/mes)</li>
        </ul>
        
        <p>Objetivo: <strong>Minimizar costo total de compra + inventario</strong>.</p>
    `,

    mostrarDatos() {
        return `
            <div class="item-dato">
                <h4>📅 Horizonte</h4>
                <p>3 meses de planificación<br>3 municipios PDET<br>2 proveedores</p>
            </div>
            <div class="item-dato">
                <h4>💻 Equipos</h4>
                <p>Tablets educativas<br>Routers de conectividad<br>Compatibilidad obligatoria</p>
            </div>
            <div class="item-dato">
                <h4>⚡ Datos Económicos</h4>
                <p>Costo unitario: $500<br>Costo inventario: $10/und/mes<br>Capacidad proveedor: 500 und/mes<br>Presupuesto mensual: $50.000</p>
            </div>
        `;
    },

    resolver() {
        // Modelo que reproduce la infactibilidad del Python original
        // Demanda: 3 municipios × 100 und = 300 und/mes de tablets
        //          3 municipios × 50 und = 150 und/mes de routers (asumido)
        // Costo total mensual: (300 + 150) × $500 = $225.000
        // Presupuesto: $50.000 → INFACTIBLE
        
        const modelo = {
            optimize: "costo_total",
            opType: "min",
            constraints: {
                // Demanda total mes 1: 300 tablets + 150 routers = 450 unidades
                demanda_m1: { equal: 450 },
                
                // Presupuesto mes 1: máximo $50.000
                // A $500 por unidad → máximo 100 unidades
                presupuesto_m1: { max: 50000 },
                
                // Capacidad proveedor 1 mes 1
                cap_p1_m1: { max: 500 },
                
                // Capacidad proveedor 2 mes 1
                cap_p2_m1: { max: 500 }
            },
            variables: {
                // Compras proveedor 1 mes 1
                compra_p1_m1: { 
                    demanda_m1: 1, 
                    presupuesto_m1: 500, 
                    cap_p1_m1: 1, 
                    costo_total: 500 
                },
                
                // Compras proveedor 2 mes 1
                compra_p2_m1: { 
                    demanda_m1: 1, 
                    presupuesto_m1: 500, 
                    cap_p2_m1: 1, 
                    costo_total: 500 
                }
            }
            // Sin 'ints' → variables continuas (LP)
        };

        const resultado = solver.Solve(modelo);
        
        console.log("Resultado avanzado1:", resultado);

        // Verificar factibilidad
        if (!resultado.feasible) {
            return {
                feasible: false,
                bounded: false,
                estado: 'Infeasible',
                objetivo: 0,
                variables: [
                    { nombre: "Estado del modelo", valor: "Infactible" },
                    { nombre: "Demanda total mensual", valor: "450 unidades" },
                    { nombre: "Costo requerido", valor: "$225.000" },
                    { nombre: "Presupuesto disponible", valor: "$50.000" },
                    { nombre: "Déficit", valor: "$175.000" }
                ]
            };
        }

        // Si por alguna razón fuera factible (no debería)
        const compra_p1 = resultado.compra_p1_m1 || 0;
        const compra_p2 = resultado.compra_p2_m1 || 0;

        return {
            feasible: resultado.feasible,
            bounded: resultado.bounded,
            estado: 'Optimal',
            objetivo: resultado.result,
            variables: [
                { nombre: "Compra Proveedor 1 - Mes 1", valor: compra_p1.toFixed(2) },
                { nombre: "Compra Proveedor 2 - Mes 1", valor: compra_p2.toFixed(2) },
                { nombre: "Compra Total Mes 1", valor: (compra_p1 + compra_p2).toFixed(2) }
            ]
        };
    }
};