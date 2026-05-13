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
  logIn(user, pwd)
})