class RecordManager {
  constructor() {
    this.modalEditado = null
    this.registroActual = null
  }

  crearModal() {
    const modal = document.createElement('div')
    modal.id = 'modal-registro'
    modal.className = 'modal'
    modal.innerHTML = `
      <div class="modal-contenido">
        <div class="modal-header">
          <h2>Opciones del Registro</h2>
          <button class="cerrar-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-acciones">
            <button id="btn-editar" class="btn-accion btn-editar">✏️ Editar</button>
            <button id="btn-tarifa" class="btn-accion btn-tarifa">💵 Salida</button>
            <button id="btn-eliminar" class="btn-accion btn-eliminar">🗑️ Eliminar</button>
            <button id="btn-cancelar" class="btn-accion btn-cancelar">Cancelar</button>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    this.modalEditado = modal

    modal.querySelector('.cerrar-modal').addEventListener('click', () => this.cerrarModal())
    modal.querySelector('#btn-cancelar').addEventListener('click', () => this.cerrarModal())
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.cerrarModal()
    })
  }

  crearModalEdicion() {
    const modal = document.createElement('div')
    modal.id = 'modal-edicion'
    modal.className = 'modal'
    modal.innerHTML = `
      <div class="modal-contenido modal-edicion">
        <div class="modal-header">
          <h2>Editar Registro</h2>
          <button class="cerrar-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="form-edicion">
            <div class="form-group">
              <label for="edit-placa">Placa del Vehículo:</label>
              <input type="text" id="edit-placa" required maxlength="7" placeholder = "A123HFT">
            </div>
            <div class="form-group">
              <label for="edit-slot">Slot (Espacio):</label>
              <input type="text" id="edit-slot" required placeholder="1" step="1" min="1" max="50">
            </div>
            <div class="form-group">
              <label for="edit-tipo">Tipo de Vehículo:</label>
              <select id="edit-tipo" required>
                <option value="">Selecciona un tipo...</option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-tarifa">Tarifa:</label>
              <input type="text" id="edit-tarifa" required>
            </div>
            <div class="form-group">
              <label for="edit-horaEntrada">Hora de Entrada:</label>
              <input type="time" id="edit-horaEntrada" required>
            </div>
            <div class="modal-acciones">
              <button type="submit" class="btn-guardar">💾 Guardar</button>
              <button type="button" class="btn-cancelar-edicion">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    this.modalEdicion = modal

    this.llenarSelectTipos('edit-tipo')
    modal.querySelector('.cerrar-modal').addEventListener('click', () => this.cerrarModalEdicion())
    modal.querySelector('.btn-cancelar-edicion').addEventListener('click', () => this.cerrarModalEdicion())
    modal.querySelector('#form-edicion').addEventListener('submit', (e) => this.guardarEdicion(e))
  }

  llenarSelectTipos(selectId) {
    const select = document.getElementById(selectId)
    if (!select) return

    const tipos = obtenerTipos()
    tipos.forEach(tipo => {
      const option = document.createElement('option')
      option.value = tipo.codigo
      option.textContent = tipo.nombre
      select.appendChild(option)
    })
  }

  mostrarModalOpciones(registro, fila) {
    if (!this.modalEditado) this.crearModal()

    this.registroActual = registro
    this.filaActual = fila

    const modal = this.modalEditado
    modal.style.display = 'flex'

    modal.querySelector('#btn-editar').onclick = () => this.abrirEdicion(registro)
    modal.querySelector('#btn-tarifa').onclick = () => this.registrarSalida(registro)
    modal.querySelector('#btn-eliminar').onclick = () => this.eliminarRegistro(registro)
  }

  abrirEdicion(registro) {
    if (!this.modalEdicion) this.crearModalEdicion()

    document.getElementById('edit-placa').value = registro.placa
    document.getElementById('edit-slot').value = registro.slot
    document.getElementById('edit-tipo').value = this.obtenerCodigoTipo(registro.tipo)
    document.getElementById('edit-tarifa').value = registro.tarifa
    document.getElementById('edit-horaEntrada').value = this.convertirAHoraInput(registro.horaEntrada)

    this.cerrarModal()
    this.modalEdicion.style.display = 'flex'
  }

  obtenerCodigoTipo(nombreTipo) {
    const tipos = obtenerTipos()
    const tipo = tipos.find(t => t.nombre === nombreTipo)
    return tipo ? tipo.codigo : ''
  }

  convertirAHoraInput(horaAMPM) {
    if (!horaAMPM) return ''
    const [hora, minuto] = horaAMPM.split(':')
    const minutoSolo = minuto.substring(0, 2)
    return `${hora}:${minutoSolo}`
  }

  guardarEdicion(e) {
    e.preventDefault()

    const placa = document.getElementById('edit-placa').value.trim()
    const slot = document.getElementById('edit-slot').value.trim()
    const codigoTipo = document.getElementById('edit-tipo').value
    const tarifa = document.getElementById('edit-tarifa').value
    const horaEntrada = document.getElementById('edit-horaEntrada').value

    const formato = /^[A-Z]\d{3}[A-Z]{3}$/
    if (!formato.test(placa)) {
      alert("⚠️ Error: Formato de placa incorrecto")
      return
    }

    const registros = JSON.parse(localStorage.getItem('vehicleRecords')) || []

    const placaExistente = registros.some(r => 
      r.placa === placa && r.id !== this.registroActual.id
    )
    if (placaExistente) {
      alert('⚠️ Error: La placa ' + placa + ' ya está registrada en el sistema.')
      return
    }

    const slotOcupado = registros.some(s => 
      s.slot === slot && s.id !== this.registroActual.id
    )
    if (slotOcupado) {
      alert('⚠️ Error: El slot ' + slot + ' ya está registrado en el sistema.')
      return
    }

    const tipoSeleccionado = obtenerTipos().find(t => t.codigo === codigoTipo)
    const nombreTipo = tipoSeleccionado ? tipoSeleccionado.nombre : codigoTipo

    const indice = registros.findIndex(r => r.id === this.registroActual.id)

    if (indice !== -1) {
      registros[indice] = {
        ...registros[indice],
        placa: placa,
        slot: slot,
        tipo: nombreTipo,
        tarifa: tarifa,
        horaEntrada: this.convertirAFormatoAMPM(horaEntrada)
      }
      
      localStorage.setItem('vehicleRecords', JSON.stringify(registros))
      this.cerrarModalEdicion()
      cargarRegistros()
      alert('✓ Registro actualizado exitosamente')
    }
  }

  convertirAFormatoAMPM(horaInput) {
    if (!horaInput) return ''
    let [horas, minutos] = horaInput.split(':').map(Number)
    const ampm = horas >= 12 ? 'PM' : 'AM'
    horas = horas % 12
    horas = horas ? horas : 12
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')} ${ampm}`
  }

  calcularTarifa(registro) {
    const horaEntrada = this.convertirAMinutos(registro.horaEntrada)
    const ahora = new Date()
    let horas = ahora.getHours()
    const minutos = ahora.getMinutes()
    const ampm = horas >= 12 ? 'PM' : 'AM'
    horas = horas % 12
    horas = horas ? horas : 12
    const horaActualFormato = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')} ${ampm}`
    const horaActualMinutos = this.convertirAMinutos(horaActualFormato)

    let minutosTranscurridos = horaActualMinutos - horaEntrada
    if (minutosTranscurridos < 0) {
      minutosTranscurridos += 24 * 60
    }

    const horasTranscurridas = Math.ceil(minutosTranscurridos / 60)
    const tarifaHora = this.extraerNumeroTarifa(registro.tarifa)
    const tarifaTotal = horasTranscurridas * tarifaHora

    return {
      horasTranscurridas,
      tarifaHora,
      tarifaTotal,
      horaActual: horaActualFormato
    }
  }

  convertirAMinutos(horaAMPM) {
    const partes = horaAMPM.split(' ')
    let [horas, minutos] = partes[0].split(':').map(Number)
    const ampm = partes[1] || 'AM'

    if (ampm === 'PM' && horas !== 12) horas += 12
    if (ampm === 'AM' && horas === 12) horas = 0

    return horas * 60 + minutos
  }

  extraerNumeroTarifa(tarifa) {
    const numero = tarifa.replace(/[^\d.]/g, '')
    return parseFloat(numero) || 0
  }

  registrarSalida(registro) {
    const tarifa = this.calcularTarifa(registro)
    const registros = JSON.parse(localStorage.getItem('vehicleRecords')) || []
    const indice = registros.findIndex(r => r.id === registro.id)

    if (indice !== -1) {

      guardarRegistroFacturado(registro, tarifa)
      registros.splice(indice, 1)
      localStorage.setItem('vehicleRecords', JSON.stringify(registros))
    }

    const slotLimpios = JSON.parse(localStorage.getItem('slotsLimpios')) || []
    if (!slotLimpios.includes(registro.slot)) {
      slotLimpios.push(registro.slot)
    }
    localStorage.setItem('slotsLimpios', JSON.stringify(slotLimpios))

    this.cerrarModal()
    cargarRegistros()

    alert(
      `✅ SALIDA REGISTRADA\n\n` +
      `Placa: ${registro.placa}\n` +
      `Entrada: ${registro.horaEntrada}\n` +
      `Salida: ${tarifa.horaActual}\n` +
      `Tiempo: ${tarifa.horasTranscurridas} hora(s)\n` +
      `Tarifa por hora: Q${tarifa.tarifaHora}\n` +
      `Total a pagar: Q${tarifa.tarifaTotal}`
    )
  }

  eliminarRegistro(registro) {
    if (confirm(`¿Estás seguro de que deseas eliminar el registro de la placa ${registro.placa}?`)) {
      const registros = JSON.parse(localStorage.getItem('vehicleRecords')) || []
      const registrosFiltrados = registros.filter(r => r.id !== registro.id)
      localStorage.setItem('vehicleRecords', JSON.stringify(registrosFiltrados))
      this.cerrarModal()
      cargarRegistros()
      alert('Registro eliminado exitosamente')
    }
  }

  cerrarModal() {
    if (this.modalEditado) this.modalEditado.style.display = 'none'
  }

  cerrarModalEdicion() {
    if (this.modalEdicion) this.modalEdicion.style.display = 'none'
  }

  agregarBotonesFila(registro, fila) {
    const celda = document.createElement('td')
    celda.className = 'acciones'
    celda.innerHTML = `
      <button class="btn-fila btn-opciones" title="Opciones">⚙️</button>
    `
    celda.querySelector('.btn-opciones').addEventListener('click', () => {
      this.mostrarModalOpciones(registro, fila)
    })
    fila.appendChild(celda)
  }
}

const recordManager = new RecordManager()

function guardarRegistroFacturado(registro, tarifa) {
  const registrosFacturados = JSON.parse(localStorage.getItem('registrosFacturados')) || []
  
  const registroFacturado = {
    ...registro,
    horaEntrada: registro.horaEntrada,
    horaSalida: tarifa.horaActual,
    horasTranscurridas: tarifa.horasTranscurridas,
    tarifaHora: tarifa.tarifaHora,
    tarifaTotal: tarifa.tarifaTotal,
    fechaFacturacion: formatearFecha(new Date())
  }
  
  registrosFacturados.push(registroFacturado)
  localStorage.setItem('registrosFacturados', JSON.stringify(registrosFacturados))
}