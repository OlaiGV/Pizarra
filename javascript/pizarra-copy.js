window.onload = function () {
  // Variables
  let buttonIniciar = document.querySelector(".iniciar");
  let colorUsuario = document.querySelector('input[type="color"]');
  let grosoresLapiz = document.querySelectorAll(".grosor-pincel div");
  let pincel = document.querySelector(".pincel");
  let gomaBorrar = document.querySelector(".gomaBorrar");
  let borrarTodo = document.querySelector(".borrar-todo");
  let pintarFondo = document.querySelector(".pintar-fondo");
  let subrayador = document.querySelector(".subrayador");
  let contenedorlInfo = document.querySelector(".panel-info");
  let imagenesIzquierda = document.querySelectorAll(".dibujos-izquierda img");
  let imagenesDerecha = document.querySelectorAll(".dibujos-derecha img");

  // Iconos
  let iconoGomaBorrar =
    "url('./imagenes/iconos/goma-de-borrar.png')0 100, auto";
  let iconoLapiz = "url('./imagenes/iconos/lapiz.png')0 100, auto";
  let iconoSubrayador = "url('./imagenes/iconos/marcador.png')0 100, auto";

  // Variables para el canvas
  let canvas = document.querySelector("#canvas");
  let contenedorPizarra = document.querySelector(".contenedorpizarra");
  ctx = canvas.getContext("2d");

  // Valor fijo para aplicar el desplazamiento del contenedor Info
  const desplazamientoPanelInfo = "-1000px";

  // Estado del lienzo
  let comenzarTrazo = false;
  let color = "black";
  let anchoPincel = 1;
  let isSubrayador = false;
  let isBorrando = false;

  // Función autoinvocada que asigna los escuchadores
  (function addListeners() {
    buttonIniciar.addEventListener("click", iniciarPizarra);
    borrarTodo.addEventListener("click", borrarPizarra);
    pincel.addEventListener("click", pintar);
    gomaBorrar.addEventListener("click", borrar);
    pintarFondo.addEventListener("click", pintarFondoLienzo);
    subrayador.addEventListener("click", pintarSubrayador);
    grosoresLapiz.forEach((grosor) => {
      grosor.addEventListener("click", () =>
        estableceGrosor(parseInt(grosor.dataset.grosor))
      );
    });

    // Añadir escuchadores a las imágenes para pintar el fondo del canvas
    for (let img of imagenesDerecha) {
      img.addEventListener("click", () => {
        establecerFondoDibujo(img.getAttribute("src"));
      });
    }

    // Añadir escuchadores a las imágenes para pintar el fondo del canvas
    for (let img of imagenesIzquierda) {
      img.addEventListener("click", () => {
        establecerFondoDibujo(img.getAttribute("src"));
      });
    }
  })();

  // Función para pintar la pizarraF
  function iniciarPizarra() {
    // Ocultar el panel de inicio y mostrar la pizarra
    contenedorlInfo.style.top = desplazamientoPanelInfo;
    contenedorPizarra.style.top = "0";
    canvas.style.cursor = iconoLapiz;
  }

  // Función que permite pintar sobre el lienzo
  function pintar() {
    ctx.lineWidth = anchoPincel;
    canvas.style.cursor = iconoLapiz;
    ctx.globalCompositeOperation = "source-over"; // Cambia el modo de composición a pintar
    isSubrayador = false;
    isBorrando = false;
  }

  // Función para pintar con un subrayador de color amarillo
  function pintarSubrayador() {
    ctx.lineWidth = 15;
    canvas.style.cursor = iconoSubrayador;
    ctx.globalCompositeOperation = "source-over"; // Cambia el modo de composición a pintar
    isSubrayador = true;
    isBorrando = false;
  }

  // Función que permite borrar lo pintado
  function borrar() {
    ctx.lineWidth = 20;
    canvas.style.cursor = iconoGomaBorrar;
    ctx.globalCompositeOperation = "destination-out"; // Utiliza el modo de composición para "borrar"
    isSubrayador = false;
    isBorrando = true;
  }

  // Función que permite cambiar el color al lienzo
  function pintarFondoLienzo() {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over"; // Cambia el modo de composición a pintar
    isSubrayador = false;
    isBorrando = true;
  }

  // Evento que recoge el color seleccionado en el input por el usuario
  colorUsuario.addEventListener("input", () => {
    console.log(colorUsuario.value);
    color = colorUsuario.value;

    grosoresLapiz.forEach((grosor) => {
      grosor.style.backgroundColor = color;
    });
  });

  // Eventos de ratón a escuchar
  canvas.addEventListener("mousedown", pulsaRaton);
  canvas.addEventListener("mousemove", mueveRaton);
  document.addEventListener("mouseup", levantaRaton);

  // Función para cambiar el grosor del lapiz
  function estableceGrosor(grosor) {
    ctx.lineWidth = grosor;
  }

  // Limpiar pizarra
  function borrarPizarra() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundImage = "none"
  }

  function pulsaRaton(even) {
    comenzarTrazo = true;

    // Indica que se empieza a pintar
    ctx.beginPath();

    // Obtener coordenadas X e Y del ratón y corregimos la distancia del canvas
    ctx.moveTo(even.offsetX, even.offsetY);
  }

  function mueveRaton(even) {
    if (comenzarTrazo) {
      // Establecemos color de linea y dibujamos
      ctx.strokeStyle = isSubrayador ? "yellow" : color;
      ctx.lineTo(even.offsetX, even.offsetY);
      ctx.stroke();
    }
  }

  function levantaRaton() {
    // Al soltar el botón del ratón finaliza el trazo a la espera del siguiente
    ctx.closePath();
    comenzarTrazo = false;
  }

  function establecerFondoDibujo(imagen) {
    canvas.style.backgroundImage = `url(${imagen})`;
    canvas.style.backgroundColor = "white";
  }
};
