let turnoActivo = 1
let ultimasCelulas = []

// ========================
// CAMBIAR TURNO - Solo muestra/oculta carros
// ========================
function setTurno(turno) {
    turnoActivo = turno
    document.getElementById('btn1').classList.toggle('active', turno === 1)
    document.getElementById('btn2').classList.toggle('active', turno === 2)

    // ✅ Solo cambia visibilidad, NO recarga datos
    document.querySelectorAll('.car-t1').forEach(c => {
        c.style.opacity = turno === 1 ? '1' : '0.2'
    })
    document.querySelectorAll('.car-t2').forEach(c => {
        // ✅ Si el carro tiene clase 'sin-datos' no se muestra nunca
        if (!c.classList.contains('sin-datos')) {
            c.style.opacity = turno === 2 ? '1' : '0.2'
        }
    })
}

// ========================
// OBTENER DATOS - Carga células de AMBOS turnos
// ========================
async function getDatos() {
    try {
        const response = await fetch('http://localhost:3000')
        if (!response.ok) return []
        const data = await response.json()
        const rows = data.results[0].tables[0].rows

        const params    = new URLSearchParams(window.location.search)
        const unitIndex = parseInt(params.get('unit')) || 0

        const config = JSON.parse(localStorage.getItem('scoreConfig')) || {
            turno1: [[], [], [], []],
            turno2: [[], [], [], []]
        }

        // ✅ Unión de células de ambos turnos (sin duplicados)
        const celulasT1 = config.turno1[unitIndex] || []
        const celulasT2 = config.turno2[unitIndex] || []
        const todasCelulas = [...new Set([...celulasT1, ...celulasT2])]

        // ✅ Filtrar filas y agregar flag de qué turnos tiene cada célula
        const filtered = rows
            .filter(r => todasCelulas.includes(r['[Cell_Name]']))
            .map(r => ({
                ...r,
                tieneT1: celulasT1.includes(r['[Cell_Name]']),
                tieneT2: celulasT2.includes(r['[Cell_Name]'])
            }))

        // ✅ Quitar duplicados por Cell_Name
        const vistos = new Set()
        return filtered.filter(r => {
            if (vistos.has(r['[Cell_Name]'])) return false
            vistos.add(r['[Cell_Name]'])
            return true
        })

    } catch (error) {
        console.error('❌ Error:', error)
        return []
    }
}

// ========================
// RENDER - Dibuja UNA sola vez
// ========================
function Rockets(celulas) {
    const container  = document.getElementById('rocketContainer')
    const container2 = document.getElementById('alertaContainer')

    // ✅ Limpiar antes de dibujar
    container.innerHTML  = ''
    container2.innerHTML = ''

    if (!celulas || celulas.length === 0) {
        container2.innerHTML = `<p class="error">No hay células asignadas</p>`
        return
    }

    const maxT1      = Math.max(...celulas.map(c => c['[Turno1]'] || 0))
    const maxT2      = Math.max(...celulas.map(c => c['[Turno2]'] || 0))
    const MAX_ESCALA = Math.max(maxT1, maxT2) + 4

    // Escala
    const scaleContainer = document.querySelector('.scale')
    scaleContainer.innerHTML = ''
    for (let i = MAX_ESCALA; i >= 0; i--) {
        const span = document.createElement('span')
        span.textContent = i
        scaleContainer.appendChild(span)
    }

    const spans = scaleContainer.querySelectorAll('span')
    const spanPositions = {}
    spans.forEach((span, index) => {
        const num  = MAX_ESCALA - index
        const rect = span.getBoundingClientRect()
        spanPositions[num] = rect.left + rect.width / 2
    })

    const CAR_WIDTH  = 10
    const FLAG_WIDTH = 50

    function calcPos(valor) {
        const centro = spanPositions[valor] ?? spanPositions[0]
        return Math.min(centro - CAR_WIDTH, window.innerWidth - FLAG_WIDTH - CAR_WIDTH)
    }

    celulas.forEach((celula) => {
        const nombre  = celula['[Cell_Name]']
        const t1      = celula['[Turno1]'] || 0
        const t2      = celula['[Turno2]'] || 0
        const tieneT1 = celula.tieneT1
        const tieneT2 = celula.tieneT2

        const posT1 = calcPos(t1)
        const posT2 = calcPos(t2)

        const lane = document.createElement('div')
        lane.className = 'lane'
        lane.innerHTML = `
            <span class="cell-label">${nombre}</span>

            <!-- Turno 1 -->
            <div class="car car-t1 ${!tieneT1 ? 'sin-datos' : ''}" 
                style="left:${posT1}px; opacity:${!tieneT1 ? '0' : turnoActivo === 1 ? '1' : '0.2'}">
                <img src="assets/CarroF1-2.png" class="rocket-img">
                <p class="rocket-score">${t1} Rechazos</p>
            </div>

            <!-- Turno 2 - ✅ Oculto si no tiene células en T2 -->
            <div class="car car-t2 ${!tieneT2 ? 'sin-datos' : ''}" 
                style="left:${posT2}px; opacity:${!tieneT2 ? '0' : turnoActivo === 2 ? '1' : '0.2'}">
                <img src="assets/CarroF1.png" class="rocket-img">
                <p class="rocket-score">${t2} Rechazos</p>
            </div>

            <div class="meta"></div>
        `
        container.appendChild(lane)
    })
}

// ========================
// INIT - Solo carga datos UNA vez
// ========================
async function init() {
    const params    = new URLSearchParams(window.location.search)
    const unitIndex = parseInt(params.get('unit')) || 0

    const NOMBRES = { 0: "F's", 1: "Comercial", 2: "Electronicas", 3: "Deadbolts" }
    document.getElementById('tituloUnidad').textContent = NOMBRES[unitIndex]

    ultimasCelulas = await getDatos()
    Rockets(ultimasCelulas)
}

init()
setInterval(init, 60000)
// ============================================
// ✅ AUTO SCROLL
// ============================================
let scrollInterval = null
let scrollDir      = 1
let scrollSpeed    = 1

function iniciarAutoScroll() {
    const sky = document.querySelector('.sky')
    if (!sky) return

    // ✅ Limpia intervalo anterior si existe
    if (scrollInterval) clearInterval(scrollInterval)

    scrollInterval = setInterval(() => {
        sky.scrollTop += scrollDir * scrollSpeed

        // ✅ Llegó abajo → sube
        if (sky.scrollTop + sky.clientHeight >= sky.scrollHeight - 2) {
            scrollDir = -1
        }

        // ✅ Llegó arriba → baja
        if (sky.scrollTop <= 0) {
            scrollDir = 1
        }
    }, 100)
}

// ✅ Inicia al cargar
iniciarAutoScroll()

// ============================================
// ✅ ROTACIÓN DE PANTALLA
// ============================================
screen.orientation.addEventListener('change', () => {
    console.log('📱 Pantalla rotada! Recargando...')
    location.reload()
})

window.addEventListener('resize', () => {
    console.log('📐 Tamaño cambiado! Recalculando...')

    clearInterval(scrollInterval)

    if (ultimasCelulas && ultimasCelulas.length > 0) {
        Rockets(ultimasCelulas)
    }

    setTimeout(() => {
        iniciarAutoScroll()
    }, 600)
})