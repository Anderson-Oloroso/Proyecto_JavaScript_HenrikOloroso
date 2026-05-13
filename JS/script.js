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

const submit = document.getElementById('btn-type') 
submit.addEventListener('click', () => {
  const user = document.getElementById('email').value 
  const pwd = document.getElementById('password').value 
  const p = document.getElementById('messege') 
  p.style = 'margin-top: 1rem' 
  p.textContent = 'Validando información por favor espere ...' 

  setTimeout(() => {
    logIn(user, pwd) 
    p.textContent = ''
    }, 3000)
  })

function obtenerHoraActual() {
  const ahora = new Date() 
  let horas = ahora.getHours() 
  const minutos = String(ahora.getMinutes()).padStart(2, '0') 
  const ampm = horas >= 12 ? 'AM' : 'PM' 
  
  horas = horas % 12 
  horas = horas ? horas : 12  
  const horasStr = String(horas).padStart(2, '0') 
  
  return `${horasStr}:${minutos} ${ampm}` 
}

function obtenerTipos() {
  const datos = localStorage.getItem('vehicleTypes') 
  return datos ? JSON.parse(datos) : [] 
}

function guardarTipo(tipo) {
  const tipos = obtenerTipos() 
  tipos.push(tipo) 
  localStorage.setItem('vehicleTypes', JSON.stringify(tipos)) 
}

function cargarTipos() {
  const tablaTipos = document.getElementById('tabla-tipos') 
  if (!tablaTipos) return 

  const tipos = obtenerTipos() 
  tablaTipos.innerHTML = '' 

  if (tipos.length === 0) {
    tablaTipos.innerHTML = '<tr><td colspan="4">No hay tipos de vehículo registrados.</td></tr>' 
    return 
  }

  tipos.forEach(tipo => {
    const fila = document.createElement('tr') 
    fila.innerHTML = `
      <td>${tipo.codigo}</td>
      <td>${tipo.nombre}</td>
      <td>${tipo.tarifa}</td>
      <td>${tipo.hora}</td>
    ` 
    tablaTipos.appendChild(fila) 
  }) 
}

function registerTypeVehicle() {
  const cod = document.getElementById('code').value.trim() 
  const name = document.getElementById('nombre').value.trim() 
  const tarifa = document.getElementById('precio').value.trim() 
  const currentHour = obtenerHoraActual() 

  guardarTipo({
    codigo: cod,
    nombre: name,
    tarifa: tarifa,
    hora: currentHour
  }) 
}

const submitType = document.getElementById('btn-type') 
if (submitType) {
  submitType.addEventListener('click', event => {
    event.preventDefault() 
    const p = document.getElementById('message') 
    p.style = 'margin-top: 1rem' 
    p.textContent = 'Registrando tipo de vehículo por favor espere ...' 
    setTimeout(() => {
      registerTypeVehicle() 
      alert('Tipo de vehículo registrado exitosamente') 
      p.textContent = '' 
      cargarTipos() 
    }, 3000) 
  }) 
}

cargarTipos() 
