"use strict";

/* ==========================================
   SIGNBRIDGE - MÁS COLORES
   10 LECCIONES
   PROGRESO + VIDEO + TRANSICIONES
========================================== */


/* ==========================================
   LECCIONES
========================================== */

const lecciones = [

    {
        nombre: "Naranja",
        descripcion:
            "Aprende la seña correspondiente al color naranja.",
        color: "#f97316"
    },

    {
        nombre: "Morado",
        descripcion:
            "Aprende la seña correspondiente al color morado.",
        color: "#8b5cf6"
    },

    {
        nombre: "Rosado",
        descripcion:
            "Aprende la seña correspondiente al color rosado.",
        color: "#ec4899"
    },

    {
        nombre: "Gris",
        descripcion:
            "Aprende la seña correspondiente al color gris.",
        color: "#94a3b8"
    },

    {
        nombre: "Café",
        descripcion:
            "Aprende la seña correspondiente al color café.",
        color: "#92400e"
    },

    {
        nombre: "Celeste",
        descripcion:
            "Aprende la seña correspondiente al color celeste.",
        color: "#38bdf8"
    },

    {
        nombre: "Turquesa",
        descripcion:
            "Aprende la seña correspondiente al color turquesa.",
        color: "#14b8a6"
    },

    {
        nombre: "Beige",
        descripcion:
            "Aprende la seña correspondiente al color beige.",
        color: "#d6b98c"
    },

    {
        nombre: "Violeta",
        descripcion:
            "Aprende la seña correspondiente al color violeta.",
        color: "#7c3aed"
    },

    {
        nombre: "Dorado",
        descripcion:
            "Aprende la seña correspondiente al color dorado.",
        color: "#eab308"
    }

];


/* ==========================================
   VARIABLES
========================================== */

let leccionActual = 0;

const TOTAL_LECCIONES = lecciones.length;


/* ==========================================
   OBTENER USUARIO
========================================== */

function obtenerUsuario() {

    try {

        const datos =
            localStorage.getItem("usuarioSignbridge");

        if (!datos) {
            return null;
        }

        return JSON.parse(datos);

    } catch (error) {

        console.error(
            "Error al obtener usuario:",
            error
        );

        return null;
    }
}


/* ==========================================
   GUARDAR PROGRESO
========================================== */

function guardarProgreso() {

    const usuario = obtenerUsuario();

    if (!usuario) {
        return;
    }

    if (!usuario.progreso) {
        usuario.progreso = {};
    }


    const porcentaje = Math.round(
        ((leccionActual + 1) / TOTAL_LECCIONES) * 100
    );


    const progresoAnterior =
        Number(
            usuario.progreso.masColores
        ) || 0;


    /*
       Nunca reducimos el progreso.
    */

    usuario.progreso.masColores =
        Math.max(
            progresoAnterior,
            porcentaje
        );


    usuario.progreso.masColoresLeccion =
        leccionActual;


    localStorage.setItem(
        "usuarioSignbridge",
        JSON.stringify(usuario)
    );
}


/* ==========================================
   RECUPERAR PROGRESO
========================================== */

function recuperarProgreso() {

    const usuario = obtenerUsuario();

    if (!usuario || !usuario.progreso) {
        return 0;
    }


    const guardada =
        Number(
            usuario.progreso.masColoresLeccion
        );


    if (
        Number.isInteger(guardada) &&
        guardada >= 0 &&
        guardada < TOTAL_LECCIONES
    ) {
        return guardada;
    }


    return 0;
}


/* ==========================================
   ELEMENTOS
========================================== */

const learningCard =
    document.getElementById("learningCard");

const numeroLeccion =
    document.getElementById("numeroLeccion");

const totalLecciones =
    document.getElementById("totalLecciones");

const progresoTexto =
    document.getElementById("progresoTexto");

const barraProgreso =
    document.getElementById("barraProgreso");

const numeroTema =
    document.getElementById("numeroTema");

const tituloLeccion =
    document.getElementById("tituloLeccion");

const descripcionLeccion =
    document.getElementById("descripcionLeccion");

const indicacionLeccion =
    document.getElementById("indicacionLeccion");

const colorCircle =
    document.getElementById("colorCircle");

const colorReferenceText =
    document.getElementById("colorReferenceText");

const videoLeccion =
    document.getElementById("videoLeccion");

const videoSource =
    document.getElementById("videoSource");

const videoPlaceholder =
    document.getElementById("videoPlaceholder");

const anteriorLeccion =
    document.getElementById("anteriorLeccion");

const siguienteLeccion =
    document.getElementById("siguienteLeccion");

const completionScreen =
    document.getElementById("completionScreen");

const porcentajeFinal =
    document.getElementById("porcentajeFinal");

const volverCursos =
    document.getElementById("volverCursos");

const volverCursosFinal =
    document.getElementById("volverCursosFinal");


/* ==========================================
   INICIAR
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        totalLecciones.textContent =
            TOTAL_LECCIONES;


        leccionActual =
            recuperarProgreso();


        mostrarLeccion(
            leccionActual,
            false
        );


        document.body.classList.add(
            "page-ready"
        );


        prepararEventos();
    }
);


/* ==========================================
   MOSTRAR LECCIÓN
========================================== */

function mostrarLeccion(
    indice,
    animar = true
) {

    const leccion =
        lecciones[indice];


    if (!leccion) {
        return;
    }


    if (animar) {

        learningCard.classList.add(
            "changing"
        );


        setTimeout(
            () => {

                actualizarContenido(
                    leccion,
                    indice
                );

                learningCard.classList.remove(
                    "changing"
                );

            },
            250
        );

    } else {

        actualizarContenido(
            leccion,
            indice
        );
    }
}


/* ==========================================
   ACTUALIZAR CONTENIDO
========================================== */

function actualizarContenido(
    leccion,
    indice
) {

    const numero =
        indice + 1;


    const porcentaje =
        Math.round(
            (numero / TOTAL_LECCIONES) * 100
        );


    numeroLeccion.textContent =
        numero;

    numeroTema.textContent =
        `COLOR ${String(numero).padStart(2, "0")}`;

    tituloLeccion.textContent =
        leccion.nombre;

    descripcionLeccion.textContent =
        leccion.descripcion;

    indicacionLeccion.textContent =
        `Observa la referencia del color y el video de la seña cuando esté disponible.`;


    colorCircle.style.background =
        leccion.color;

    colorReferenceText.textContent =
        leccion.nombre;


    progresoTexto.textContent =
        `${porcentaje}%`;

    barraProgreso.style.width =
        `${porcentaje}%`;


    actualizarVideo(
        indice,
        leccion.nombre
    );


    anteriorLeccion.disabled =
        indice === 0;


    siguienteLeccion.textContent =
        indice === TOTAL_LECCIONES - 1
            ? "Completar curso ✓"
            : "Siguiente →";
}


/* ==========================================
   VIDEO
========================================== */

function actualizarVideo(
    indice,
    nombre
) {

    /*
       Los videos quedarán preparados
       para agregarlos posteriormente.

       Ejemplo de ruta futura:

       ../videos/colores/naranja.mp4
    */

    const rutaVideo =
        "";

    videoSource.src =
        rutaVideo;


    videoLeccion.load();


    if (rutaVideo.trim() === "") {

        videoLeccion.style.display =
            "none";

        videoPlaceholder.style.display =
            "flex";

        return;
    }


    videoLeccion.style.display =
        "block";

    videoPlaceholder.style.display =
        "none";
}


/* ==========================================
   SIGUIENTE
========================================== */

function siguiente() {

    /*
       Guardamos el progreso actual
       antes de continuar.
    */

    guardarProgreso();


    if (
        leccionActual <
        TOTAL_LECCIONES - 1
    ) {

        leccionActual++;

        guardarProgreso();

        mostrarLeccion(
            leccionActual,
            true
        );

        return;
    }


    completarCurso();
}


/* ==========================================
   ANTERIOR
========================================== */

function anterior() {

    if (leccionActual <= 0) {
        return;
    }


    leccionActual--;


    mostrarLeccion(
        leccionActual,
        true
    );
}


/* ==========================================
   COMPLETAR CURSO
========================================== */

function completarCurso() {

    const usuario =
        obtenerUsuario();


    if (usuario) {

        if (!usuario.progreso) {
            usuario.progreso = {};
        }


        usuario.progreso.masColores =
            100;


        usuario.progreso.masColoresLeccion =
            TOTAL_LECCIONES - 1;


        localStorage.setItem(
            "usuarioSignbridge",
            JSON.stringify(usuario)
        );
    }


    porcentajeFinal.textContent =
        "100%";


    learningCard.style.display =
        "none";

    completionScreen.hidden =
        false;


    requestAnimationFrame(() => {

        completionScreen.classList.add(
            "show"
        );

    });
}


/* ==========================================
   TRANSICIÓN DE SALIDA
========================================== */

function navegarSuave(destino) {

    document.body.classList.remove(
        "page-ready"
    );

    document.body.classList.add(
        "page-exiting"
    );


    setTimeout(() => {

        window.location.href =
            destino;

    }, 400);
}


/* ==========================================
   EVENTOS
========================================== */

function prepararEventos() {

    siguienteLeccion.addEventListener(
        "click",
        siguiente
    );


    anteriorLeccion.addEventListener(
        "click",
        anterior
    );


    volverCursos.addEventListener(
        "click",
        () => {

            navegarSuave(
                "colores-cursos.html"
            );

        }
    );


    volverCursosFinal.addEventListener(
        "click",
        () => {

            navegarSuave(
                "colores-cursos.html"
            );

        }
    );
}


/* ==========================================
   EVITAR PERDER PROGRESO
========================================== */

window.addEventListener(
    "beforeunload",
    () => {

        guardarProgreso();

    }
);