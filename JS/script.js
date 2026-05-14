const pantalla = document.getElementById('pantalla') 
const total = document.querySelectorAll('section').length 
let indice = 0 

if (pantalla && total > 0) {
  setInterval(() => {
    indice = (indice + 1) % total 
    pantalla.style.transform = `translateX(-${indice * 100}%)` 
  }, 3000) 
}

const usuario = {
  name_: 'admin',
  email_: 'admin@tufavorito.com',
  password_: 'Admin_159'
} 

localStorage.setItem('usuario', JSON.stringify(usuario)) 

function logIn(user, password) {
  const userCredentials = JSON.parse(localStorage.getItem('usuario')) 

  if (user === userCredentials.email_ && password === userCredentials.password_) {
    alert('¡Bienvenido ' + userCredentials.name_ + '!') 
    window.location.href = 'records.html' 
  } else if (user === userCredentials.email_ && password !== userCredentials.password_) {
    alert('Estimado usuario, tu contraseña es incorrecta') 
  } else if (user !== userCredentials.email_) {
    alert('Usuario inexistente') 
  } else {
    alert('Credenciales incorrectas') 
  }
}

const submit = document.getElementById('btn-login') 
if (submit) {
  submit.addEventListener('click', () => {
    const user = document.getElementById('email').value 
    const pwd = document.getElementById('password').value 
    const p = document.getElementById('messege') 
    if (p) {
      p.style = 'margin-top: 1rem' 
      p.textContent = 'Validando información por favor espere ...' 
    }

    setTimeout(() => {
      logIn(user, pwd) 
      if (p) p.textContent = ''
    }, 3000)
  })
}


function obtenerHoraActual() {
  const ahora = new Date() 
  let horas = ahora.getHours() 
  const minutos = String(ahora.getMinutes()).padStart(2, '0') 
  const ampm = horas >= 12 ? 'PM' : 'AM' 
  
  horas = horas % 12 
  horas = horas ? horas : 12  
  const horasStr = String(horas).padStart(2, '0') 
  
  return `${horasStr}:${minutos} ${ampm}` 
}

function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const anio = fecha.getFullYear()
  return `${dia}/${mes}/${anio}`
}

function registrarEntrada() {
  const placa = document.getElementById('placa').value.trim() 
  const tipo = document.getElementById('tipo').value 
  const slot = document.getElementById('slot').value.trim() 
  const horaEntrada = obtenerHoraActual()
  const fecha = formatearFecha(new Date())
  const tipoSeleccionado = obtenerTipos().find(t => t.codigo === tipo)
  const tipoNombre = tipoSeleccionado ? tipoSeleccionado.nombre : tipo
  const tarifa = tipoSeleccionado ? tipoSeleccionado.tarifa : 'Q0'
  const registro = {
    placa: placa,
    tipo: tipoNombre,
    fecha: fecha,
    horaEntrada: horaEntrada,
    slot: slot,
    tarifa: tarifa
  }
  
}

function insertTypesToSelect() {
  const selectTipo = document.getElementById('tipo') 
  if (!selectTipo) return

  const tipos = obtenerTipos() 
  tipos.forEach(tipo => {
    const option = document.createElement('option') 
    option.value = tipo.codigo
    option.textContent = tipo.nombre
    selectTipo.appendChild(option) 
  }) 
}

insertTypesToSelect()

function cargarRegistros() {
  const tablaRegistros = document.getElementById('tabla-registros') 
  if (!tablaRegistros) return
  const registros = JSON.parse(localStorage.getItem('vehicleRecords')) || []
  tablaRegistros.innerHTML = ''
  if (registros.length === 0) {
    tablaRegistros.innerHTML = '<tr><td colspan="6">No hay registros de vehículos.</td></tr>'
    return
  }
  registros.forEach(registro => {
    const fila = document.createElement('tr')
    fila.innerHTML = `
      <td>${registro.placa}</td>
      <td>${registro.tipo}</td>
      <td>${registro.fecha}</td>
      <td>${registro.horaEntrada}</td>
      <td>${registro.slot}</td>
      <td>${registro.tarifa}</td>
    `
    tablaRegistros.appendChild(fila)
  })
}


function obtenerTipos() {
  const datos = localStorage.getItem('vehicleTypes') 
  return datos ? JSON.parse(datos) : [] 
}

function guardarTipo(tipo) {
  const tipos = obtenerTipos() 
  const codigosUnicos = new Set(tipos.map(t => t.codigo))
  if (codigosUnicos.has(tipo.codigo)) {
    alert('Código ya registrado')
    return
  }
  tipos.push(tipo) 
  localStorage.setItem('vehicleTypes', JSON.stringify(tipos)) 
}

function cargarTipos() {
  const tablaTipos = document.getElementById('tabla-tipos') 
  if (!tablaTipos) return 

  const tipos = obtenerTipos() 
  const codigosUnicos = [...new Set(tipos.map(t => t.codigo))]
  const tiposUnicos = codigosUnicos.map(codigo => tipos.find(t => t.codigo === codigo))

  tablaTipos.innerHTML = '' 

  if (tiposUnicos.length === 0) {
    tablaTipos.innerHTML = '<tr><td colspan="3">No hay tipos de vehículo registrados.</td></tr>' 
    return 
  }

  tiposUnicos.forEach(tipo => {
    const fila = document.createElement('tr') 
    fila.innerHTML = `
      <td>${tipo.codigo}</td>
      <td>${tipo.nombre}</td>
      <td>${tipo.tarifa}</td>
    ` 
    tablaTipos.appendChild(fila) 
  }) 
}

function registerTypeVehicle() {
  const cod = document.getElementById('code').value.trim() 
  const name = document.getElementById('nombre').value.trim() 
  const tarifa = document.getElementById('precio').value.trim() 

  guardarTipo({
    codigo: cod,
    nombre: name,
    tarifa: tarifa
  }) 
}

const submitType = document.getElementById('register-vehicle-type') 
if (submitType) {
  submitType.addEventListener('submit', event => {
    event.preventDefault() 

    const p = document.getElementById('message') 
    if(p){
      p.style = 'margin-top: 1rem' 
      p.textContent = 'Registrando tipo de vehículo por favor espere ...' 
    }
    setTimeout(() => {
      registerTypeVehicle() 
      alert('Tipo de vehículo registrado exitosamente') 
      p.textContent = '' 
      cargarTipos() 
    }, 3000) 
  }) 
}

const formRegistrar = document.getElementById('register-vehicle');
if (formRegistrar) {
  formRegistrar.addEventListener('submit', event => {
    event.preventDefault(); // Ahora sí detendrá el envío del formulario correctamente
    
    const p = document.getElementById('message');
    if (p) {
      p.style = 'margin-top: 1rem';
      p.textContent = 'Registrando vehículo por favor espere ...';
    }
    setTimeout(() => {
      registrarEntrada();
      if (p) p.textContent = '';
      cargarRegistros();
    }, 3000);
  });
}

cargarTipos() 
cargarRegistros() 
