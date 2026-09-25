"use strict";

/* =========================================================
   SIGNBRIDGE - REPASO DE LETRAS ALEATORIO
========================================================= */

const letras = [
    "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T", "U",
    "V", "W", "X", "Y", "Z"
];


/* =========================================================
   VARIABLES
========================================================= */

let ordenRepaso = [];
let ejercicioActual = 0;
let respuestaCorrecta = false;
let cambiando = false;


/* =========================================================
   ELEMENTOS
========================================================= */

const imagenLetra = document.getElementById("imagenLetra");
const contador = document.getElementById("contador");
const opciones = document.getElementById("opciones");
const resultado = document.getElementById("resultado");
const resultadoTitulo = document.getElementById("resultadoTitulo");
const resultadoMensaje = document.getElementById("resultadoMensaje");
const resultadoIcono = document.getElementById("resultadoIcono");
const siguiente = document.getElementById("siguiente");
const barraProgreso = document.getElementById("barraProgreso");
const progresoTexto = document.getElementById("progresoTexto");
const finalScreen = document.getElementById("finalScreen");
const volver = document.getElementById("volver");
const volverInicio = document.getElementById("volverInicio");


/* =========================================================
   CREAR ORDEN ALEATORIO
========================================================= */

function crearOrdenAleatorio() {

    ordenRepaso = [...letras];

    for (
        let i = ordenRepaso.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            ordenRepaso[i],
            ordenRepaso[j]
        ] = [
            ordenRepaso[j],
            ordenRepaso[i]
        ];
    }
}


/* =========================================================
   OBTENER USUARIO
========================================================= */

function obtenerUsuario() {

    try {

        const datos =
            localStorage.getItem(
                "usuarioSignbridge"
            );

        return datos
            ? JSON.parse(datos)
            : null;

    } catch (error) {

        console.error(
            "Error leyendo usuario:",
            error
        );

        return null;
    }
}


/* =========================================================
   GUARDAR USUARIO
========================================================= */

function guardarUsuario(usuario) {

    localStorage.setItem(
        "usuarioSignbridge",
        JSON.stringify(usuario)
    );

    try {

        const usuarios =
            JSON.parse(
                localStorage.getItem(
                    "usuariosSignbridge"
                )
            ) || [];

        const indice =
            usuarios.findIndex(
                user =>
                    String(user.id) ===
                    String(usuario.id)
            );

        if (indice !== -1) {

            usuarios[indice] = usuario;

            localStorage.setItem(
                "usuariosSignbridge",
                JSON.stringify(usuarios)
            );
        }

    } catch (error) {

        console.error(
            "Error guardando usuarios:",
            error
        );
    }
}


/* =========================================================
   GUARDAR PROGRESO
========================================================= */

function guardarProgreso() {

    const usuario =
        obtenerUsuario();

    if (!usuario) {
        return;
    }

    if (!usuario.progreso) {
        usuario.progreso = {};
    }

    const progreso =
        Math.round(
            ((ejercicioActual + 1) /
                ordenRepaso.length) * 100
        );

    const anterior =
        Number(
            usuario.progreso.repasoLetras
        ) || 0;

    usuario.progreso.repasoLetras =
        Math.max(
            anterior,
            progreso
        );

    usuario.progreso.repasoLetrasEjercicio =
        ejercicioActual;

    guardarUsuario(usuario);
}


/* =========================================================
   LETRA ACTUAL
========================================================= */

function obtenerLetraActual() {

    return ordenRepaso[
        ejercicioActual
    ];
}


/* =========================================================
   GENERAR OPCIONES
========================================================= */

function generarOpciones() {

    opciones.innerHTML = "";

    const correcta =
        obtenerLetraActual();

    const opcionesSet =
        new Set();

    opcionesSet.add(correcta);


    while (opcionesSet.size < 4) {

        const aleatoria =
            letras[
                Math.floor(
                    Math.random() *
                    letras.length
                )
            ];

        opcionesSet.add(aleatoria);
    }


    const lista =
        Array.from(opcionesSet);


    lista.sort(
        () => Math.random() - 0.5
    );


    lista.forEach(letra => {

        const boton =
            document.createElement("button");

        boton.type = "button";

        boton.className = "option";

        boton.textContent = letra;

        boton.addEventListener(
            "click",
            () => seleccionarRespuesta(
                boton,
                letra
            )
        );

        opciones.appendChild(boton);
    });
}


/* =========================================================
   ACTUALIZAR EJERCICIO
========================================================= */

function actualizarEjercicio() {

    const letra =
        obtenerLetraActual();

    respuestaCorrecta = false;

    resultado.classList.remove("show");

    siguiente.disabled = true;


    contador.textContent =
        `${ejercicioActual + 1} / ${ordenRepaso.length}`;


    const progreso =
        ((ejercicioActual + 1) /
            ordenRepaso.length) * 100;


    barraProgreso.style.width =
        `${progreso}%`;

    progresoTexto.textContent =
        `${Math.round(progreso)}%`;


    imagenLetra.classList.remove(
        "image-in"
    );

    imagenLetra.classList.add(
        "image-out"
    );


    setTimeout(() => {

        imagenLetra.src =
            `../images/abecedario/${letra}.png`;

        imagenLetra.alt =
            `Seña de la letra ${letra}`;


        imagenLetra.classList.remove(
            "image-out"
        );

        void imagenLetra.offsetWidth;

        imagenLetra.classList.add(
            "image-in"
        );


        generarOpciones();

    }, 250);


    guardarProgreso();
}


/* =========================================================
   SELECCIONAR RESPUESTA
========================================================= */

function seleccionarRespuesta(
    boton,
    letraSeleccionada
) {

    if (
        respuestaCorrecta ||
        cambiando
    ) {
        return;
    }


    const correcta =
        obtenerLetraActual();


    const botones =
        document.querySelectorAll(
            ".option"
        );


    if (
        letraSeleccionada ===
        correcta
    ) {

        respuestaCorrecta = true;


        boton.classList.add(
            "correct"
        );


        botones.forEach(
            opcion => {
                opcion.disabled = true;
            }
        );


        resultadoIcono.textContent =
            "✓";

        resultadoTitulo.textContent =
            "¡Correcto!";

        resultadoMensaje.textContent =
            `La respuesta es ${correcta}. Has identificado correctamente la seña.`;


        resultado.classList.add(
            "show"
        );


        siguiente.disabled =
            false;

    } else {

        boton.classList.add(
            "incorrect"
        );

        boton.disabled = true;


        resultadoIcono.textContent =
            "✕";

        resultadoTitulo.textContent =
            "Inténtalo de nuevo";

        resultadoMensaje.textContent =
            "Observa nuevamente la imagen y prueba con otra opción.";


        resultado.classList.add(
            "show"
        );
    }
}


/* =========================================================
   SIGUIENTE
========================================================= */

function siguienteEjercicio() {

    if (
        !respuestaCorrecta ||
        cambiando
    ) {
        return;
    }


    if (
        ejercicioActual <
        ordenRepaso.length - 1
    ) {

        cambiando = true;

        ejercicioActual++;


        setTimeout(() => {

            actualizarEjercicio();

            cambiando = false;

        }, 150);


        return;
    }


    completarRepaso();
}


/* =========================================================
   COMPLETAR
========================================================= */

function completarRepaso() {

    const usuario =
        obtenerUsuario();


    if (usuario) {

        if (!usuario.progreso) {
            usuario.progreso = {};
        }

        usuario.progreso.repasoLetras =
            100;

        usuario.progreso.repasoLetrasEjercicio =
            ordenRepaso.length - 1;

        guardarUsuario(usuario);
    }


    finalScreen.classList.add(
        "show"
    );
}


/* =========================================================
   NAVEGACIÓN SUAVE
========================================================= */

function navegarSuave(destino) {

    if (
        document.body.classList.contains(
            "page-exiting"
        )
    ) {
        return;
    }


    document.body.classList.add(
        "page-exiting"
    );


    setTimeout(() => {

        window.location.href =
            destino;

    }, 420);
}


/* =========================================================
   VOLVER
========================================================= */

if (volver) {

    volver.addEventListener(
        "click",
        () => {

            navegarSuave(
                "abecedario-cursos.html"
            );

        }
    );
}


/* =========================================================
   VOLVER AL DASHBOARD
========================================================= */

if (volverInicio) {

    volverInicio.addEventListener(
        "click",
        () => {

            navegarSuave(
                "dashboard.html"
            );

        }
    );
}


/* =========================================================
   BOTÓN SIGUIENTE
========================================================= */

siguiente.addEventListener(
    "click",
    siguienteEjercicio
);


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Cada vez que se entra al curso
         * se crea un orden completamente nuevo.
         */

        crearOrdenAleatorio();

        ejercicioActual = 0;

        actualizarEjercicio();


        requestAnimationFrame(() => {

            document.body.classList.add(
                "page-ready"
            );

        });

    }
);