const pantalla = document.getElementById('pantalla')
const total = document.querySelectorAll('section').length
let indice = 0;

setInterval(() => {
  indice = (indice + 1) % total;
  pantalla.style.transform = `translateX(-${indice * 100}%)`
}, 3000); 

const usuario = {
  name_ : "admin",
  email_ : "admin@tufavorito.com",
  password_ : "Admin_159"
};

localStorage.setItem('usuario', JSON.stringify(usuario))

function logIn(user, password){

  const userCredentials = JSON.parse(localStorage.getItem('usuario'))
  if(user === userCredentials.email_ && password === userCredentials.password_){
    alert("¡Bienvenido  "+ userCredentials.name_ +"!")
    window.location.href = 'records.html'
  }else if(user === userCredentials.email_ && password !== userCredentials.password_){
    alert("Estimado usuario, tu contraseña es icorrecta")
  }else if(user !== userCredentials.email_){
    alert("Usuarios inexistente")
  }else{
    alert("Credenciales incorrectos")
  }
  
}

const submit = document.getElementById("btn-login")
submit.addEventListener("click", ()=>{
  const user = document.getElementById("email").value
  const pwd = document.getElementById("password").value
  const p = document.getElementById("messege")
  p.style = "margin-top: 1rem"
  p.textContent = "Validando información por favor espere ..."
  setTimeout(()=>{
    logIn(user, pwd)
    p.textContent = ''
  },3000)
  
})


const registrosParqueo = [
  { 
    placa: "P-452DFG", 
    tipoVehiculo: "Sedán",       
    fecha: "13/05/2026", 
    horaEntrada: "08:15 AM", 
    slot: "A-12" 
  },
  { 
    placa: "M-891KLP", 
    tipoVehiculo: "Motocicleta", 
    fecha: "13/05/2026", 
    horaEntrada: "08:30 AM", 
    slot: "M-03" 
  },
  { 
    placa: "C-231QWE", 
    tipoVehiculo: "Camioneta",  
    fecha: "13/05/2026", 
    horaEntrada: "08:34 AM", 
    slot: "B-05" 
  }
];

const tablaBody = document.getElementById('tabla-registros');

function cargarTabla() {
  tablaBody.innerHTML = "";
  registrosParqueo.forEach(registro => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><span class="placa">${registro.placa}</span></td>
      <td class="tipo-auto">${registro.tipoVehiculo}</td>
      <td class="hora">${registro.fecha}</td>
      <td class="hora">${registro.horaEntrada}</td>
      <td><span class="tarifa">${registro.slot}</span></td>
    `;

    tablaBody.appendChild(fila);
  });
}

cargarTabla()

function obtenerHoraActual() {
  const ahora = new Date();
  let horas = ahora.getHours();
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const ampm = horas >= 12 ? 'AM' : 'PM';
  
  horas = horas % 12;
  horas = horas ? horas : 12; 
  const horasStr = String(horas).padStart(2, '0');
  
  return `${horasStr}:${minutos} ${ampm}`;
}

function registerVehicle(){
  const cod = document.getElementById("code")
  const name = document.getElementById("nombre")
  const tarifa = document.getElementById("tarifa")
  let currentHour = obtenerHoraActual()

  registerV = [
    {
      codigo:cod,
      nombre:name,
      tarifa:tarifa,
      hora: currentHour
    }
  ]
}