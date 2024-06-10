window.onload = function () {
  // Declaración de variables
  let buttonIniciar = document.querySelector(".iniciar");
  let colorUsuario = document.querySelector('input[type="color"]');
  let panelInfo = document.querySelector(".info");
  let grosoresLapiz = document.querySelectorAll(".grosor-pincel div");
  let pincel = document.querySelector(".pincel");
  let gomaBorrar = document.querySelector(".gomaBorrar");
  let borrarTodo = document.querySelector(".borrar-todo");
  let pintarFondo = document.querySelector(".pintar-fondo");
  let subrayador = document.querySelector(".subrayador");

  // Declaración de variables para el canvas
  let canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");

  // Valor fijo para aplicar el desplazamiento del contenedor Info
  const desplazamientoPanelInfo = "-1000px";

  // Estado del lienzo
  let comenzarTrazo = false;
  let color = "black";
  let colorGomaBorrar = "rgba(215, 206, 206, 0.8)";
  let anchoPincel = 1;
  let isSubrayador = false;
  let isBorrando = false;
  let colorOriginal; // Almacenar el color original antes de borrar
  let colorFondoOriginal; // Almacenar el color original del fondo

  // Asignar eventos de escucha para los diferentes grosores:
  grosoresLapiz.forEach((grosor) => {
    grosor.addEventListener("click", function () {
      estableceGrosor(parseInt(grosor.dataset.grosor));
    });
    grosor.style.backgroundColor = color;
    isSubrayador = false;
  });

  // Asignar eventos de escucha para el canvas
  canvas.addEventListener("mousedown", pulsaRaton);
  canvas.addEventListener("mousemove", mueveRaton);
  canvas.addEventListener("mouseup", levantaRaton);

  // Eventos de escucha para los botones
  buttonIniciar.addEventListener("click", pintarPizarra);
  borrarTodo.addEventListener("click", borrarPizarra);
  pincel.addEventListener("click", pintar);
  gomaBorrar.addEventListener("click", borrar);
  pintarFondo.addEventListener("click", pintarFondoLienzo);
  subrayador.addEventListener("click", pintarSubrayador);

  // Evento que recoge el color seleccionado en el input por el usuario
  colorUsuario.addEventListener("input", () => {
    color = colorUsuario.value;
    grosoresLapiz.forEach((grosor) => {
      grosor.style.backgroundColor = color;
      grosor.style.border = "1px solid black";
    });
  });

  // Función que permite pintar sobre el lienzo
  function pintar() {
    ctx.lineWidth = anchoPincel;
    canvas.style.cursor = `url('./imagenes/lapiz.png') 0 100, auto`;
    ctx.globalCompositeOperation = "source-over"; // Cambia el modo de composición a pintar
    isSubrayador = false;
    isBorrando = false;
  }

  // Función que permite borrar lo pintado
  function borrar() {
    ctx.lineWidth = 20;

    // Almacena el color original antes de usar la goma de borrar
    if (!isBorrando) {
      colorOriginal = ctx.strokeStyle; // Almacenar el color original solo si no se está borrando
    }

    canvas.style.cursor = `url('./imagenes/goma-de-borrar.png') 0 100, auto`;
    ctx.strokeStyle = colorGomaBorrar;
    ctx.globalCompositeOperation = "destination-out"; // Utiliza el modo de composición para "borrar"
    isSubrayador = false;
    isBorrando = true;
  }

  // Función que permite cambiar el color al lienzo
  function pintarFondoLienzo() {
    colorFondoOriginal = ctx.fillStyle; // Almacenar el color de fondo antes de pintar
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over"; // Cambia el modo de composición a pintar
    colorGomaBorrar = color;
    isSubrayador = false;
    isBorrando = true;
  }

  // Función para pintar con un subrayador de color amarillo
  function pintarSubrayador() {
    ctx.lineWidth = 15;
    canvas.style.cursor = `url('./imagenes/marcador.png') 0 100, auto`;
    ctx.globalCompositeOperation = "source-over"; // Cambia el modo de composición a pintar
    isSubrayador = true;
    isBorrando = false;
  }

  // Función para cambiar el grosor del lápiz
  function estableceGrosor(grosor) {
    ctx.lineWidth = grosor;
  }

  // Función para limpiar la pizarra
  function borrarPizarra() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Función para mostrar la pizarra
  function pintarPizarra() {
    panelInfo.style.top = desplazamientoPanelInfo;
    contenedorPizarra.style.display = "grid";
  }

  function pulsaRaton(even) {
    comenzarTrazo = true;
    ctx.beginPath();
    ctx.moveTo(even.offsetX, even.offsetY);
  }

  function mueveRaton(even) {
    if (comenzarTrazo) {
      ctx.strokeStyle = isSubrayador
        ? "yellow"
        : canvas.style.backgroundColor === "rgba(215, 206, 206, 0.8)"
        ? "rgba(215, 206, 206, 0.8)"
        : color;

      ctx.lineTo(even.offsetX, even.offsetY);
      ctx.stroke();
    }
  }

  function levantaRaton() {
    ctx.closePath();
    comenzarTrazo = false;
  }
};
