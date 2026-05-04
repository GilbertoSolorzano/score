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

    // ✅ Limpia siempre primero
    container.innerHTML  = ''
    container2.innerHTML = ''

    if(!celulas || celulas.length === 0) {
        container2.innerHTML = `<p class="error">⚠️ No hay células asignadas!</p>`
        return             
    }
 
    const maxT1      = Math.max(...celulas.map(c => c['[Turno1]'] || 0))
    const maxT2      = Math.max(...celulas.map(c => c['[Turno2]'] || 0))
    const MAX_ESCALA = Math.max(maxT1, maxT2) + 5

    // ✅ Escala horizontal arriba
    const scaleContainer = document.querySelector('.scale')
    if(scaleContainer) {
        scaleContainer.innerHTML = ''
        for(let i = MAX_ESCALA; i >= 0; i--) {  
            const span = document.createElement('span')
            span.textContent = i
            scaleContainer.appendChild(span)
        }
    }

    // ✅ Un carril por célula
    celulas.forEach((celula) => {
    const nombre = celula['[Cell_Name]']
    const t1     = celula['[Turno1]'] || 0
    const t2     = celula['[Turno2]'] || 0

    // ✅ Limita entre 5% y 95% para que no salga de pantalla
    const posT1 = Math.min(89, Math.max(5, 100 - (t1 / MAX_ESCALA) * 100))
    const posT2 = Math.min(89, Math.max(5, 100 - (t2 / MAX_ESCALA) * 100))

    const lane = document.createElement('div')
    lane.className = 'lane'
    lane.innerHTML = `
        <span class="cell-label">${nombre}</span>

        <div class="car car-t1 ${turnoActivo !== 1 ? 'tenue' : ''}" 
             style="left: calc(${posT1}% - 25px)">
            <img src="assets/CarroF1-2.png" class="rocket-img">
            <p class="rocket-score">${t1} rej.</p>
        </div>

        <div class="car car-t2 ${turnoActivo !== 2 ? 'tenue' : ''}" 
             style="left: calc(${posT2}% - 25px)">
            <img src="assets/CarroF1.png" class="rocket-img">
            <p class="rocket-score">${t2} rej.</p>
            
        </div>
        <div class="ground"></div>
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