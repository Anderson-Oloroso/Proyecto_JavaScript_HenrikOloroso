class TypeManager {
  constructor() {
    this.modalEditado = null
    this.tipoActual = null
  }

  crearModal() {
    const modal = document.createElement('div')
    modal.id = 'modal-tipo'
    modal.className = 'modal'
    modal.innerHTML = `
      <div class="modal-contenido">
        <div class="modal-header">
          <h2>Opciones del Tipo</h2>
          <button class="cerrar-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-acciones">
            <button id="btn-editar-tipo" class="btn-accion btn-editar">✏️ Editar</button>
            <button id="btn-eliminar-tipo" class="btn-accion btn-eliminar">🗑️ Eliminar</button>
            <button id="btn-cancelar-tipo" class="btn-accion btn-cancelar">Cancelar</button>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    this.modalEditado = modal

    modal.querySelector('.cerrar-modal').addEventListener('click', () => this.cerrarModal())
    modal.querySelector('#btn-cancelar-tipo').addEventListener('click', () => this.cerrarModal())
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.cerrarModal()
    })
  }

  crearModalEdicion() {
    const modal = document.createElement('div')
    modal.id = 'modal-edicion-tipo'
    modal.className = 'modal'
    modal.innerHTML = `
      <div class="modal-contenido modal-edicion">
        <div class="modal-header">
          <h2>Editar Tipo de Vehículo</h2>
          <button class="cerrar-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="form-edicion-tipo">
            <div class="form-group">
              <label for="edit-code">Código:</label>
              <input type="text" id="edit-code" readonly>
            </div>
            <div class="form-group">
              <label for="edit-nombre-tipo">Nombre:</label>
              <input type="text" id="edit-nombre-tipo" required>
            </div>
            <div class="form-group">
              <label for="edit-tarifa-tipo">Tarifa por Hora:</label>
              <input type="text" id="edit-tarifa-tipo" placeholder="Ej: Q50" required>
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

    modal.querySelector('.cerrar-modal').addEventListener('click', () => this.cerrarModalEdicion())
    modal.querySelector('.btn-cancelar-edicion').addEventListener('click', () => this.cerrarModalEdicion())
    modal.querySelector('#form-edicion-tipo').addEventListener('submit', (e) => this.guardarEdicion(e))
  }

  mostrarModalOpciones(tipo, fila) {
    if (!this.modalEditado) this.crearModal()

    this.tipoActual = tipo
    this.filaActual = fila

    const modal = this.modalEditado
    modal.style.display = 'flex'

    modal.querySelector('#btn-editar-tipo').onclick = () => this.abrirEdicion(tipo)
    modal.querySelector('#btn-eliminar-tipo').onclick = () => this.eliminarTipo(tipo)
  }

  abrirEdicion(tipo) {
    if (!this.modalEdicion) this.crearModalEdicion()

    document.getElementById('edit-code').value = tipo.codigo
    document.getElementById('edit-nombre-tipo').value = tipo.nombre
    document.getElementById('edit-tarifa-tipo').value = tipo.tarifa

    this.cerrarModal()
    this.modalEdicion.style.display = 'flex'
  }

  guardarEdicion(e) {
    e.preventDefault()

    const codigo = document.getElementById('edit-code').value
    const nombre = document.getElementById('edit-nombre-tipo').value
    const tarifa = document.getElementById('edit-tarifa-tipo').value

    const tipos = obtenerTipos()
    const indice = tipos.findIndex(t => t.codigo === codigo)

    if (indice !== -1) {
      tipos[indice] = {
        codigo: codigo,
        nombre: nombre,
        tarifa: tarifa
      }
      localStorage.setItem('vehicleTypes', JSON.stringify(tipos))
      this.cerrarModalEdicion()
      cargarTipos()
      alert('Tipo de vehículo actualizado exitosamente')
    }
  }

  eliminarTipo(tipo) {
    if (confirm(`¿Estás seguro de que deseas eliminar el tipo "${tipo.nombre}"?`)) {
      let tipos = obtenerTipos()
      tipos = tipos.filter(t => t.codigo !== tipo.codigo)
      localStorage.setItem('vehicleTypes', JSON.stringify(tipos))
      this.cerrarModal()
      cargarTipos()
      alert('Tipo de vehículo eliminado exitosamente')
    }
  }

  cerrarModal() {
    if (this.modalEditado) this.modalEditado.style.display = 'none'
  }

  cerrarModalEdicion() {
    if (this.modalEdicion) this.modalEdicion.style.display = 'none'
  }

  agregarBotonesFila(tipo, fila) {
    const celda = document.createElement('td')
    celda.className = 'acciones'
    celda.innerHTML = `
      <button class="btn-fila btn-opciones-tipo" title="Opciones">⚙️</button>
    `
    celda.querySelector('.btn-opciones-tipo').addEventListener('click', () => {
      this.mostrarModalOpciones(tipo, fila)
    })
    fila.appendChild(celda)
  }
}

const typeManager = new TypeManager()
