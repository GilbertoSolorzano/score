let turnoActivo = 1

function setTurno(turno) {
    turnoActivo = turno
    document.getElementById('btn1').classList.toggle('active', turno === 1)
    document.getElementById('btn2').classList.toggle('active', turno === 2)

    document.querySelectorAll('.car-t1').forEach(r => {
        r.classList.toggle('tenue', turno !== 1)
    })
    document.querySelectorAll('.car-t2').forEach(r => {
        r.classList.toggle('tenue', turno !== 2)
    })
}

async function getDatos() {
    try {
        const response = await fetch('http://localhost:3000')
        if(!response.ok) return []
        const data = await response.json()
        const rows = data.results[0].tables[0].rows

        const params        = new URLSearchParams(window.location.search)
        const unitIndex     = parseInt(params.get('unit')) || 0
        const config        = JSON.parse(localStorage.getItem('scoreConfig')) || [[], [], [], []]
        const celulasUnidad = config[unitIndex]

        // ✅ Nombres con corchetes!
        const filtered = rows.filter(r => 
            celulasUnidad.includes(r['[Cell_Name]'])
        )

        console.log('✅ Células filtradas:', filtered)
        return filtered

    } catch(error) {
        console.error('❌ Error:', error)
        return []
    }
}

function meta (){

}
 
function Rockets(celulas) {
    const container  = document.getElementById('rocketContainer')
    const container2 = document.getElementById('alertaContainer')
   
    if(!celulas || celulas.length === 0) {
        container2.innerHTML = `<p class="error">No hay células asignadas</p>`
        return             
    }
 
    const maxT1      = Math.max(...celulas.map(c => c['[Turno1]'] || 0))
    const maxT2      = Math.max(...celulas.map(c => c['[Turno2]'] || 0))
    const MAX_ESCALA = Math.max(maxT1, maxT2) + 4

    // ✅ Dibuja escala primero
    const scaleContainer = document.querySelector('.scale')
    scaleContainer.innerHTML = ''
    for(let i = MAX_ESCALA; i >= 0; i--) {  
        const span = document.createElement('span')
        span.textContent = i
        scaleContainer.appendChild(span)
    }

    // ✅ Lee posición REAL de cada número en pantalla
    // ✅ Posición real de la escala
    const spans = scaleContainer.querySelectorAll('span')
    const spanPositions = {}
    spans.forEach((span, index) => {
        const num = MAX_ESCALA - index
        const rect = span.getBoundingClientRect()
        spanPositions[num] = rect.left + rect.width / 2
    })

    const CAR_WIDTH  = 10   // ← Ancho del carro
    const FLAG_WIDTH = 50  // ← Ancho de la bandera

    function calcPos(valor) {
        const centroNumero = spanPositions[valor] ?? spanPositions[0]
        const pos    = centroNumero - CAR_WIDTH
        const limite = window.innerWidth - FLAG_WIDTH - CAR_WIDTH  // ← Límite antes de bandera

        return Math.min(pos, limite)  // ← Nunca pasa la bandera!
    }

    celulas.forEach((celula) => {
        const nombre = celula['[Cell_Name]']
        const t1     = celula['[Turno1]'] || 0
        const t2     = celula['[Turno2]'] || 0

        const posT1 = calcPos(t1)
        const posT2 = calcPos(t2)

        const lane = document.createElement('div')
        lane.className = 'lane'
        lane.innerHTML = `
            <span class="cell-label">${nombre}</span>

            <!-- ✅ Turno 1 ARRIBA del carril -->
            <div class="car car-t1 ${turnoActivo !== 1 ? 'tenue' : ''}" 
                style="left: ${posT1}px; ">
                <img src="assets/CarroF1-2.png" class="rocket-img">
                <p class="rocket-score">${t1} Rechazos</p>
            </div>

            <!-- ✅ Turno 2 ABAJO del carril -->
            <div class="car car-t2 ${turnoActivo !== 2 ? 'tenue' : ''}" 
                style="left: ${posT2}px;">
                <img src="assets/CarroF1.png" class="rocket-img">
                <p class="rocket-score">${t2} Rechazos</p>
            </div>
            <div class="meta"></div>
        `
        container.appendChild(lane)
    })
    console.log(`✅ ${celulas.length} células | MAX: ${MAX_ESCALA}`)
}
async function init() {
    const params    = new URLSearchParams(window.location.search)
    const unitIndex = parseInt(params.get('unit')) || 0

    const NOMBRES = {
        0: "F's",
        1: "Comercial",
        2: "Electronicas",
        3: "Deadbolts"
    }

    // ✅ Usa ID en vez de clase
    document.getElementById('tituloUnidad').textContent = NOMBRES[unitIndex]

    console.log('✅ Título cambiado a:', NOMBRES[unitIndex])

    const celulas = await getDatos()
    Rockets(celulas)
}

init()
setInterval(init, 60000)
// ============================================
// ✅ AUTO SCROLL
// ============================================
let scrollInterval = null
let scrollDir      = 1    // 1 = abajo, -1 = arriba
let scrollSpeed    = 1    // ← Cambia velocidad aquí

function iniciarAutoScroll() {
    const sky = document.querySelector('.sky')
    if(!sky) return

    // ✅ Limpia intervalo anterior si existe
    if(scrollInterval) clearInterval(scrollInterval)

    scrollInterval = setInterval(() => {
        sky.scrollTop += scrollDir * scrollSpeed

        // ✅ Llegó abajo → sube
        if(sky.scrollTop + sky.clientHeight >= sky.scrollHeight - 2) {
            scrollDir = -1
        }

        // ✅ Llegó arriba → baja
        if(sky.scrollTop <= 0) {
            scrollDir = 1
        }

    }, 75) // ← 60fps
}



// ✅ Inicia al cargar la página
iniciarAutoScroll()