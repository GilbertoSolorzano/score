let turnoActivo = 1

function setTurno(turno) {
    turnoActivo = turno
    document.getElementById('btn1').classList.toggle('active', turno === 1)
    document.getElementById('btn2').classList.toggle('active', turno === 2)

    document.querySelectorAll('.rocket-t1').forEach(r => {
        r.classList.toggle('tenue', turno !== 1)
    })
    document.querySelectorAll('.rocket-t2').forEach(r => {
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

function Rockets(celulas) {
    const container2 = document.getElementById('alertaContainer')
    if(!celulas || celulas.length === 0) {
        
        container2.innerHTML = `<p class="error">⚠️ No hay células asignadas!</p>`
        return
    }
    const container = document.getElementById('rocketContainer')
    // ✅ Nombres con corchetes!
    const maxT1      = Math.max(...celulas.map(c => c['[Turno1]'] || 0))
    const maxT2      = Math.max(...celulas.map(c => c['[Turno2]'] || 0))
    const MAX_ESCALA = Math.max(maxT1, maxT2) + 2

    const GROUND = 9
    const CIELO  = 88

    const scaleContainer = document.querySelector('.scale')
    if(scaleContainer) {
        scaleContainer.innerHTML = ''
        for(let i = MAX_ESCALA; i >= 0; i--) {
            const span = document.createElement('span')
            span.textContent = i
            scaleContainer.appendChild(span)
        }
    }

    let rockets = ''
    celulas.forEach((celula, i) => {
        const seccion  = 100 / celulas.length
        const posicion = (seccion * i) + (seccion / 2)

        // ✅ Nombres con corchetes!
        const nombre = celula['[Cell_Name]']
        const t1     = celula['[Turno1]'] || 0
        const t2     = celula['[Turno2]'] || 0

        const alturaT1 = GROUND + (t1 * (CIELO / MAX_ESCALA))
        const alturaT2 = GROUND + (t2 * (CIELO / MAX_ESCALA))

        rockets += `
            <div class="rocket rocket-t1 ${turnoActivo !== 1 ? 'tenue' : ''}" 
                 style="left: calc(${posicion}% - 10px); bottom: ${alturaT1}%">
                <img src="assets/cohete2-1.png" class="rocket-img">
                <p class="rocket-score">${t1} rej.</p>
            </div>

            <div class="rocket rocket-t2 ${turnoActivo !== 2 ? 'tenue' : ''}" 
                 style="left: calc(${posicion}% + 10px); bottom: ${alturaT2}%">
                <img src="assets/cohete2.png" class="rocket-img">
                <p class="rocket-score">${t2} rej.</p>
            </div>

            <div class="cell-label" style="left: ${posicion}%">
                ${nombre}
            </div>
        `
    })

    container.innerHTML = rockets
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
setInterval(init, 10000)
