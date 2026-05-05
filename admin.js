const UNIDADES = ["F's", "Comercial", "Electronicas", "Deadbolts"]

let config = JSON.parse(localStorage.getItem('scoreConfig')) || {
    turno1: [[], [], [], []],
    turno2: [[], [], [], []]
}

let turnoActual = 1
let todasCelulas = []

// ========================
// CAMBIAR TURNO
// ========================
function setTurno(num) {
    turnoActual = num
    document.getElementById('btn1').classList.toggle('active', num === 1)
    document.getElementById('btn2').classList.toggle('active', num === 2)
    renderAll()
}

function getConfigActual() {
    return config[`turno${turnoActual}`]
}

// ========================
// CARGAR CÉLULAS
// ========================
async function cargarCelulas() {
    try {
        const response = await fetch('http://localhost:3000')
        const data = await response.json()
        const rows = data.results[0].tables[0].rows

        // ✅ Quitar duplicados
        const nombres = rows.map(r => r['[Cell_Name]'])
        todasCelulas = [...new Set(nombres)]

        renderAll()
    } catch(e) {
        console.error(e)
        document.getElementById('todasCelulas').innerHTML =
            `<p style="color:red">❌ Error: Asegúrate que server.py está corriendo</p>`
    }
}

// ========================
// RENDER
// ========================
function renderAll() {
    const configActual = getConfigActual()
    const yaAsignadas = configActual.flat()
    const disponibles = todasCelulas.filter(c => !yaAsignadas.includes(c))

    // ✅ Mostrar indicador de turno activo
    document.querySelector('h1').innerHTML = 
        `⚙️ Admin - Score Dashboard 
        <span style="font-size:16px;color:${turnoActual === 1 ? '#4fc3f7' : '#ef5350'}">
            ${turnoActual === 1 ? '🔵 Turno 1' : '🔴 Turno 2'}
        </span>`

    // Render células disponibles
    const container = document.getElementById('todasCelulas')
    container.innerHTML = ''

    if (disponibles.length === 0) {
        container.innerHTML = `<p style="color:#4CAF50">✅ Todas las células están asignadas!</p>`
    }

    disponibles.forEach(celula => {
        const div = document.createElement('div')
        div.style.cssText = 'display:flex; align-items:center; gap:8px; margin:4px 0;'

        const span = document.createElement('span')
        span.style.cssText = 'background:rgba(255,255,255,0.1); padding:8px 12px; border-radius:8px; flex:1;'
        span.textContent = celula

        const select = document.createElement('select')
        select.className = 'select-unidad'
        select.innerHTML = `
            <option value="">➕ Agregar a...</option>
            ${UNIDADES.map((u, i) => `<option value="${i}">${u}</option>`).join('')}
        `
        select.onchange = () => {
            if (select.value !== '') {
                agregarCelula(celula, parseInt(select.value))
            }
        }

        div.appendChild(span)
        div.appendChild(select)
        container.appendChild(div)
    })

    // Render unidades
    UNIDADES.forEach((u, i) => {
        const lista = document.getElementById(`lista-${i}`)
        lista.innerHTML = ''

        if (configActual[i].length === 0) {
            lista.innerHTML = `<p style="color:#aaa;font-size:13px;text-align:center">Sin células</p>`
            return
        }

        configActual[i].forEach(celula => {
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

// ========================
// AGREGAR / QUITAR
// ========================
function agregarCelula(celula, unidadIndex) {
    const key = `turno${turnoActual}`
    // Quitar de cualquier unidad primero
    config[key] = config[key].map(u => u.filter(c => c !== celula))
    // Agregar a la unidad elegida
    config[key][unidadIndex].push(celula)
    renderAll()
}

function quitarCelula(celula, unidadIndex) {
    const key = `turno${turnoActual}`
    config[key][unidadIndex] = config[key][unidadIndex].filter(c => c !== celula)
    renderAll()
}

// ========================
// GUARDAR
// ========================
function guardar() {
    localStorage.setItem('scoreConfig', JSON.stringify(config))
    localStorage.setItem('turnoActual', turnoActual)

    const msg = document.getElementById('savedMsg')
    msg.style.display = 'block'
    setTimeout(() => msg.style.display = 'none', 3000)
}

cargarCelulas()