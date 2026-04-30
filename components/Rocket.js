// Sin export, directo como función global
function Rockets(cantidad) {

    const container = document.getElementById('rocketContainer')

    // ❌ Si es 0
    if(cantidad === 0) {
        container.innerHTML = `<p class="error">⚠️ Debe haber al menos 1 cohete</p>`
        return
    }

    let rockets = ''

    for(let i = 0; i < cantidad; i++) {
        const seccion = 100 / cantidad
        const posicion = (seccion * i) + (seccion / 2)

        rockets += `
            <div class="rocket" style="left: ${posicion}%">
                <img src="assets/cohete2.png" class="rocket-img" alt="cohete">
            </div>
        `
    }

    // ✅ Inserta los cohetes
    container.innerHTML = rockets
    console.log(`✅ ${cantidad} cohetes generados`) // Para verificar
}