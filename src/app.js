const tituloMusica = document.getElementById('titulo-musica');
const barraMusica = document.getElementById('barra-musica');
const cancion = document.getElementById('cancion');
const tiempoActualEl = document.getElementById('tiempo-actual');
const tiempoTotalEl = document.getElementById('tiempo-total');
const ctVolumen = document.getElementById('control-volumen');

const btnAleatorio = document.getElementById('btn-aleatorio');
const btnBucle = document.getElementById('btn-bucle');
const btnAtras = document.getElementById('btn-atras');
const btnPlayPause = document.getElementById('btn-reproducir-pausar');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnCambiaCarpeta = document.getElementById('btn-cambiar-carpeta');

const iconoPausa = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>`;
const iconoPlay = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
    </svg>`;
const iconoBucle = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>`;
const iconoAleatorio = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 21v-3.75h-3.75M19.5 6.75V3h-3.75M4.5 21l15-18M4.5 3l4.5 5.4M15 15.6l4.5 5.4" />
</svg>`;

let esAleatorioActivo = false;
let esBucleActivo = false;
let cancionesOriginales = [];

btnAleatorio.innerHTML = iconoAleatorio;
btnBucle.innerHTML = iconoBucle;

const CancionesCarpeta = document.getElementById('lista-canciones');
cancion.volume = ctVolumen.value / 100;



class Node {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

class DoubleLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    addNode(data) {
        const newNode = new Node(data);
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    limpiar() {
        this.head = null;
        this.tail = null;
    }
}

const barajarArray = (array) => {
    const nuevoArray = [...array]; 
    for (let i = nuevoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
    }
    return nuevoArray;
};

const formatearTiempo = (segundos) => {
    if (isNaN(segundos)) return "0:00";
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);
    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
};

const listaCanciones = new DoubleLinkedList();

let nodoActual = null;

const cargarCancion = () => {
    if (!nodoActual) return;

    const { titulo, fuente } = nodoActual.data;

    tituloMusica.textContent = titulo;
    cancion.src = fuente;

    cargarPlaylist();
};

const reproducirCancion = () => {
    if (!cancion.src || cancion.src.endsWith(window.location.host + "/")) return;



    cancion.play();
    btnPlayPause.innerHTML = iconoPausa;
};

const pausarCancion = () => {
    cancion.pause();
    btnPlayPause.innerHTML = iconoPlay;
};

const alternarReproduccion = () => {
    cancion.paused ? reproducirCancion() : pausarCancion();
}

const cargarPlaylist = () => {
    CancionesCarpeta.innerHTML = "";
    let nodoTemporal = listaCanciones.head;

    while (nodoTemporal !== null) {

        const CancionAdd = document.createElement('button');
        CancionAdd.className = 'text-sm text-blue-300 cursor-pointer text-left px-2 py-1 rounded w-full transition-all';

        if(nodoTemporal == nodoActual){
            CancionAdd.classList.add('bg-white/20', 'text-white', 'font-bold');
             CancionAdd.classList.remove('text-blue-300');
        } else {
            CancionAdd.classList.add('hover:bg-white/10');
        }
        CancionAdd.textContent = nodoTemporal.data.titulo;

        const nodoDestino = nodoTemporal;

        CancionAdd.addEventListener("click", () => {
            nodoActual = nodoDestino;
            cargarCancion();
            reproducirCancion();
        });

        CancionesCarpeta.appendChild(CancionAdd)

        nodoTemporal = nodoTemporal.next;

    }

}

const cambiarCancion = (direccion) => {
    if (!nodoActual) return;

    if (direccion === 1) {
        nodoActual = nodoActual.next ? nodoActual.next : listaCanciones.head;
    } else if (direccion === -1) {
        nodoActual = nodoActual.prev ? nodoActual.prev : listaCanciones.tail;
    }

    cargarCancion();
    reproducirCancion();
};

btnPlayPause.addEventListener("click", alternarReproduccion);
btnSiguiente.addEventListener("click", () => cambiarCancion(1));
btnAtras.addEventListener("click", () => cambiarCancion(-1));

btnBucle.addEventListener("click", () => {
    esBucleActivo = !esBucleActivo;

    if (esBucleActivo) {
        
        btnBucle.classList.remove('text-blue-300/50');
        btnBucle.style.color = '#38bdf8'; 
        btnBucle.style.filter = 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))';
    } else {
        btnBucle.classList.add('text-blue-300/50');
        btnBucle.style.color = '';
        btnBucle.style.filter = '';
    }
});

btnAleatorio.addEventListener("click", () => {
    esAleatorioActivo = !esAleatorioActivo;

    if (esAleatorioActivo) {
        btnAleatorio.classList.remove('text-blue-300/50');
        btnAleatorio.style.color = '#38bdf8';
        btnAleatorio.style.filter = 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))';
    } else {
        btnAleatorio.classList.add('text-blue-300/50');
        btnAleatorio.style.color = '';
        btnAleatorio.style.filter = '';
    }
    if (cancionesOriginales.length > 0) {
        const cancionSonando = nodoActual ? nodoActual.data : null;
        
        listaCanciones.limpiar();

        const cancionesAUsar = esAleatorioActivo ? barajarArray(cancionesOriginales) : cancionesOriginales;

        cancionesAUsar.forEach(cancionData => {
            listaCanciones.addNode(cancionData);
        });

        if (cancionSonando) {
            let temp = listaCanciones.head;
            while (temp) {
                if (temp.data.fuente === cancionSonando.fuente) {
                    nodoActual = temp;
                    break;
                }
                temp = temp.next;
            }
        } else {
            nodoActual = listaCanciones.head;
        }

        cargarPlaylist();
    }
});
cancion.addEventListener("loadedmetadata", () => {
    barraMusica.max = cancion.duration;
    barraMusica.value = 0;

    tiempoTotalEl.textContent = formatearTiempo(cancion.duration);
    tiempoActualEl.textContent = "0:00";
});

cancion.addEventListener("timeupdate", () => {
    if (!cancion.paused) {
        barraMusica.value = cancion.currentTime;
    }
    tiempoActualEl.textContent = formatearTiempo(cancion.currentTime);
});

barraMusica.addEventListener("input", () => {
    cancion.currentTime = barraMusica.value;
    tiempoActualEl.textContent = formatearTiempo(barraMusica.value);
});

ctVolumen.addEventListener('input', (e) => {
    cancion.volume = e.target.value / 100;
});

barraMusica.addEventListener("change", () => {
    reproducirCancion();
});

const obtenerRutaGuardada = async (ruta) => {
    try {

        const canciones = await window.electronAPI.obtenerCanciones(ruta);

        listaCanciones.limpiar();
        nodoActual = null;
        pausarCancion();

        if (!canciones || canciones.length === 0) {
            tituloMusica.textContent = "Carpeta de música vacía";
            CancionesCarpeta.innerHTML = "<p class='text-xs opacity-70'>No se encontraron canciones.</p>";
            return;
        }
        cancionesOriginales = [...canciones];
        const cancionesAUsar = esAleatorioActivo ? barajarArray(cancionesOriginales) : cancionesOriginales;

        cancionesAUsar.forEach(cancionData => {
            listaCanciones.addNode(cancionData);
        });

        nodoActual = listaCanciones.head;

        cargarPlaylist();
        cargarCancion();

    } catch (error) {
        console.error("Error al cargar canciones:", error);
    }
};

cancion.addEventListener("ended", () => {
    if (esBucleActivo) {
        cancion.currentTime = 0;
        reproducirCancion()
    } else {
        cambiarCancion(1);
    }
});

const iniciarReproductor = async () => {

    const rutaGuardada = await window.electronAPI.obtenerRutaGuardada();

    if (rutaGuardada) {
        obtenerRutaGuardada(rutaGuardada);
    } else {
        tituloMusica.textContent = "Sin carpeta";
    }
};

if (btnCambiaCarpeta) {
    btnCambiaCarpeta.addEventListener('click', async () => {
        const nuevaRuta = await window.electronAPI.seleccionarCarpeta();
        if (nuevaRuta) {
            obtenerRutaGuardada(nuevaRuta);
        }
    });
}

iniciarReproductor();