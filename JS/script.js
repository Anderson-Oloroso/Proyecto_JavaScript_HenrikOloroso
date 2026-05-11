const pantalla = document.getElementById('pantalla');
const total = document.querySelectorAll('section').length;
let indice = 0;

setInterval(() => {
  indice = (indice + 1) % total;
  pantalla.style.transform = `translateX(-${indice * 100}%)`;
}, 3000); // Cambia de imagen cada 3 segundos
