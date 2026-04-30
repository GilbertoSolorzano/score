    const UNIDADES = ["F's", "Comercial", "Electronicas", "Deadbolts"]
    let config = JSON.parse(localStorage.getItem('scoreConfig')) || [[], [], [], []]
    let todasCelulas = []

    // Cargar células de Power BI
    async function cargarCelulas() {
        try {
            const response = await fetch('http://localhost:3000')
            const data = await response.json()
            const rows = data.results[0].tables[0].rows
            todasCelulas = rows.map(r => r['[Cell_Name]'])
            renderAll()
        } catch(e) {
            document.getElementById('todasCelulas').innerHTML = 
                `<p style="color:red">❌ Error: Asegúrate que server.py está corriendo</p>`
        }
    }

    function renderAll() {
        // ✅ Células ya asignadas a alguna unidad
        const yaAsignadas = config.flat()

        // ✅ Solo muestra células SIN asignar
        const disponibles = todasCelulas.filter(c => !yaAsignadas.includes(c))

        // Render células disponibles
        const container = document.getElementById('todasCelulas')
        container.innerHTML = ''

        if(disponibles.length === 0) {
            container.innerHTML = `<p style="color:#4CAF50">✅ Todas las células están asignadas!</p>`
        }

        disponibles.forEach(celula => {
            const div = document.createElement('div')
            div.style.display = 'flex'
            div.style.alignItems = 'center'
            div.style.gap = '8px'

            const span = document.createElement('span')
            span.style.background = 'rgba(255,255,255,0.1)'
            span.style.padding = '8px 12px'
            span.style.borderRadius = '8px'
            span.textContent = celula

            const select = document.createElement('select')
            select.className = 'select-unidad'
            select.innerHTML = `
                <option value="">➕ Agregar a...</option>
                ${UNIDADES.map((u, i) => `<option value="${i}">${u}</option>`).join('')}
            `
            select.onchange = () => {
                if(select.value !== '') {
                    agregarCelula(celula, parseInt(select.value))
                    select.value = ''
                }
            }

            div.appendChild(span)
            div.appendChild(select)
            container.appendChild(div)
        })

        // Render listas de unidades
        UNIDADES.forEach((u, i) => {
            const lista = document.getElementById(`lista-${i}`)
            lista.innerHTML = ''

            if(config[i].length === 0) {
                lista.innerHTML = `<p style="color:#aaa;font-size:13px;text-align:center">Sin células</p>`
                return
            }

            config[i].forEach(celula => {
                const item = document.createElement('div')
                item.className = 'celula-item'
                item.innerHTML = `
                    <span>🚀 ${celula}</span>
                    <button onclick="quitarCelula('${celula}', ${i})">✕</button>
                `
                lista.appendChild(item)
            })
        })
    }
    function agregarCelula(celula, unidadIndex) {
        // Quitar de otras unidades primero
        config = config.map(u => u.filter(c => c !== celula))
        // Agregar a la unidad seleccionada
        if(!config[unidadIndex].includes(celula)) {
            config[unidadIndex].push(celula)
        }
        renderAll()
    }

    function quitarCelula(celula, unidadIndex) {
        config[unidadIndex] = config[unidadIndex].filter(c => c !== celula)
        renderAll()
    }

    function guardar() {
        localStorage.setItem('scoreConfig', JSON.stringify(config))
        const msg = document.getElementById('savedMsg')
        msg.style.display = 'block'
        setTimeout(() => msg.style.display = 'none', 3000)
    }
    
    function abrirUnidad(index) {
        const nombre = UNIDADES[index]
        window.open(`index.html?unit=${index}&name=${encodeURIComponent(nombre)}`, '_blank')
    }
    cargarCelulas()