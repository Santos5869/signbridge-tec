"use strict";

/* ==========================================
   SIGNBRIDGE - ABECEDARIO
   TRANSICIONES + PROGRESO POR USUARIO
========================================== */


/* ==========================================
   LISTA DE LETRAS
========================================== */

const letras = [

    {
        letra: "A",
        imagen: "../images/abecedario/A.png",
        descripcion:
            "Seña correspondiente a la letra A de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "B",
        imagen: "../images/abecedario/B.png",
        descripcion:
            "Seña correspondiente a la letra B de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "C",
        imagen: "../images/abecedario/C.png",
        descripcion:
            "Seña correspondiente a la letra C de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "D",
        imagen: "../images/abecedario/D.png",
        descripcion:
            "Seña correspondiente a la letra D de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "E",
        imagen: "../images/abecedario/E.png",
        descripcion:
            "Seña correspondiente a la letra E de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "F",
        imagen: "../images/abecedario/F.png",
        descripcion:
            "Seña correspondiente a la letra F de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "G",
        imagen: "../images/abecedario/G.png",
        descripcion:
            "Seña correspondiente a la letra G de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "H",
        imagen: "../images/abecedario/H.png",
        descripcion:
            "Seña correspondiente a la letra H de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "I",
        imagen: "../images/abecedario/I.png",
        descripcion:
            "Seña correspondiente a la letra I de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "J",
        imagen: "../images/abecedario/J.png",
        descripcion:
            "Seña correspondiente a la letra J de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "K",
        imagen: "../images/abecedario/K.png",
        descripcion:
            "Seña correspondiente a la letra K de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "L",
        imagen: "../images/abecedario/L.png",
        descripcion:
            "Seña correspondiente a la letra L de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "M",
        imagen: "../images/abecedario/M.png",
        descripcion:
            "Seña correspondiente a la letra M de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "N",
        imagen: "../images/abecedario/N.png",
        descripcion:
            "Seña correspondiente a la letra N de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "O",
        imagen: "../images/abecedario/O.png",
        descripcion:
            "Seña correspondiente a la letra O de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "P",
        imagen: "../images/abecedario/P.png",
        descripcion:
            "Seña correspondiente a la letra P de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "Q",
        imagen: "../images/abecedario/Q.png",
        descripcion:
            "Seña correspondiente a la letra Q de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "R",
        imagen: "../images/abecedario/R.png",
        descripcion:
            "Seña correspondiente a la letra R de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "S",
        imagen: "../images/abecedario/S.png",
        descripcion:
            "Seña correspondiente a la letra S de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "T",
        imagen: "../images/abecedario/T.png",
        descripcion:
            "Seña correspondiente a la letra T de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "U",
        imagen: "../images/abecedario/U.png",
        descripcion:
            "Seña correspondiente a la letra U de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "V",
        imagen: "../images/abecedario/V.png",
        descripcion:
            "Seña correspondiente a la letra V de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "W",
        imagen: "../images/abecedario/W.png",
        descripcion:
            "Seña correspondiente a la letra W de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "X",
        imagen: "../images/abecedario/X.png",
        descripcion:
            "Seña correspondiente a la letra X de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "Y",
        imagen: "../images/abecedario/Y.png",
        descripcion:
            "Seña correspondiente a la letra Y de la Lengua de Señas Nicaragüense."
    },

    {
        letra: "Z",
        imagen: "../images/abecedario/Z.png",
        descripcion:
            "Seña correspondiente a la letra Z de la Lengua de Señas Nicaragüense."
    }

];


/* ==========================================
   VARIABLES
========================================== */

let indice = 0;
let cambiando = false;


/* ==========================================
   ELEMENTOS
========================================== */

const titulo =
    document.getElementById("titulo");

const imagen =
    document.getElementById("imagen");

const descripcion =
    document.getElementById("descripcion");

const barra =
    document.getElementById("barra");

const contador =
    document.querySelector(".lesson-counter");

const btnAnterior =
    document.getElementById("anterior");

const btnSiguiente =
    document.getElementById("siguiente");

const pantallaFinal =
    document.getElementById("finalScreen");

const btnVolverInicio =
    document.getElementById("volverInicio");

const btnVolver =
    document.getElementById("volver");


/* ==========================================
   USUARIO ACTIVO
========================================== */

function obtenerUsuarioActivo() {

    try {

        const datos =
            localStorage.getItem(
                "usuarioSignbridge"
            );

        if (!datos) {
            return null;
        }

        return JSON.parse(datos);

    } catch (error) {

        console.error(
            "Error obteniendo usuario:",
            error
        );

        return null;
    }
}


/* ==========================================
   GUARDAR USUARIO
========================================== */

function guardarUsuarioActivo(usuario) {

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


        const posicion =
            usuarios.findIndex(
                user =>
                    String(user.id) ===
                    String(usuario.id)
            );


        if (posicion !== -1) {

            usuarios[posicion] =
                usuario;

            localStorage.setItem(
                "usuariosSignbridge",
                JSON.stringify(usuarios)
            );
        }

    } catch (error) {

        console.error(
            "Error actualizando usuarios:",
            error
        );
    }
}


/* ==========================================
   GUARDAR PROGRESO
========================================== */

function guardarProgresoAbecedario() {

    const usuario =
        obtenerUsuarioActivo();


    if (!usuario) {
        return;
    }


    if (!usuario.progreso) {
        usuario.progreso = {};
    }


    const porcentaje =
        Math.round(
            ((indice + 1) / letras.length) * 100
        );


    const progresoAnterior =
        Number(
            usuario.progreso.abecedario
        ) || 0;


    usuario.progreso.abecedario =
        Math.max(
            progresoAnterior,
            porcentaje
        );


    /*
       Guardamos la posición para
       poder continuar después.
    */

    usuario.progreso.abecedarioLeccion =
        indice;


    guardarUsuarioActivo(usuario);
}


/* ==========================================
   ACTUALIZAR INTERFAZ
========================================== */

function actualizarInterfaz() {

    const actual =
        letras[indice];


    const progreso =
        ((indice + 1) / letras.length) * 100;


    titulo.textContent =
        actual.letra;


    imagen.src =
        actual.imagen;

    imagen.alt =
        `Letra ${actual.letra}`;


    descripcion.textContent =
        actual.descripcion;


    contador.textContent =
        `${indice + 1} / ${letras.length}`;


    barra.style.width =
        `${progreso}%`;


    btnAnterior.disabled =
        indice === 0;


    btnSiguiente.textContent =
        indice === letras.length - 1
            ? "Completar curso ✓"
            : "Siguiente →";
}


/* ==========================================
   MOSTRAR LETRA CON TRANSICIÓN
========================================== */

function mostrarLetra(direccion = "next") {

    if (cambiando) {
        return;
    }


    cambiando = true;


    imagen.classList.add("fade-out");
    titulo.classList.add("fade-out");
    descripcion.classList.add("fade-out");


    setTimeout(() => {

        actualizarInterfaz();


        imagen.classList.remove("fade-out");
        titulo.classList.remove("fade-out");
        descripcion.classList.remove("fade-out");


        void imagen.offsetWidth;


        imagen.classList.add("fade-in");
        titulo.classList.add("fade-in");
        descripcion.classList.add("fade-in");


        setTimeout(() => {

            imagen.classList.remove("fade-in");
            titulo.classList.remove("fade-in");
            descripcion.classList.remove("fade-in");

            cambiando = false;

        }, 420);

    }, 220);


    guardarProgresoAbecedario();
}


/* ==========================================
   COMPLETAR CURSO
========================================== */

function mostrarPantallaFinal() {

    const usuario =
        obtenerUsuarioActivo();


    if (usuario) {

        if (!usuario.progreso) {
            usuario.progreso = {};
        }


        usuario.progreso.abecedario =
            100;


        usuario.progreso.abecedarioLeccion =
            letras.length - 1;


        guardarUsuarioActivo(usuario);
    }


    if (!pantallaFinal) {
        return;
    }


    pantallaFinal.classList.add("show");
}


/* ==========================================
   SIGUIENTE
========================================== */

function irSiguiente() {

    if (cambiando) {
        return;
    }


    if (
        indice <
        letras.length - 1
    ) {

        indice++;

        mostrarLetra("next");

        return;
    }


    mostrarPantallaFinal();
}


/* ==========================================
   ANTERIOR
========================================== */

function irAnterior() {

    if (
        cambiando ||
        indice <= 0
    ) {
        return;
    }


    indice--;

    mostrarLetra("previous");
}


/* ==========================================
   NAVEGACIÓN SUAVE
========================================== */

function navegarSuave(destino) {

    if (
        document.body.classList.contains(
            "page-exiting"
        )
    ) {
        return;
    }


    document.body.classList.remove(
        "page-ready"
    );


    document.body.classList.add(
        "page-exiting"
    );


    setTimeout(() => {

        window.location.href =
            destino;

    }, 420);
}


/* ==========================================
   EVENTOS
========================================== */

btnSiguiente.addEventListener(
    "click",
    irSiguiente
);


btnAnterior.addEventListener(
    "click",
    irAnterior
);


if (btnVolver) {

    btnVolver.addEventListener(
        "click",
        () => {

            navegarSuave(
                "cursos.html"
            );

        }
    );

}


if (btnVolverInicio) {

    btnVolverInicio.addEventListener(
        "click",
        () => {

            navegarSuave(
                "dashboard.html"
            );

        }
    );

}


/* ==========================================
   TECLADO
========================================== */

document.addEventListener(
    "keydown",
    (evento) => {

        if (
            evento.key === "ArrowRight"
        ) {

            evento.preventDefault();

            irSiguiente();
        }


        if (
            evento.key === "ArrowLeft"
        ) {

            evento.preventDefault();

            irAnterior();
        }

    }
);


/* ==========================================
   INICIO
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const usuario =
            obtenerUsuarioActivo();


        /*
           Recuperamos la última letra
           guardada si existe.
        */

        const leccionGuardada =
            Number(
                usuario?.progreso
                    ?.abecedarioLeccion
            );


        if (
            Number.isInteger(
                leccionGuardada
            ) &&
            leccionGuardada >= 0 &&
            leccionGuardada < letras.length
        ) {

            indice =
                leccionGuardada;
        }


        actualizarInterfaz();


        requestAnimationFrame(() => {

            document.body.classList.add(
                "page-ready"
            );

        });

    }
);