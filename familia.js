// ==========================================
// SIGNBRIDGE - CURSO DE FAMILIA
// ==========================================

"use strict";


// ==========================================
// LECCIONES
// ==========================================

const lecciones = [

    {
        nombre: "PADRE",
        emoji: "👨",
        descripcion: "Aprende la seña correspondiente a padre.",
        video: "../videos/familia/padre.mp4"
    },

    {
        nombre: "MADRE",
        emoji: "👩",
        descripcion: "Aprende la seña correspondiente a madre.",
        video: "../videos/familia/madre.mp4"
    },

    {
        nombre: "HIJO",
        emoji: "👦",
        descripcion: "Aprende la seña correspondiente a hijo.",
        video: "../videos/familia/hijo.mp4"
    },

    {
        nombre: "HIJA",
        emoji: "👧",
        descripcion: "Aprende la seña correspondiente a hija.",
        video: "../videos/familia/hija.mp4"
    },

    {
        nombre: "ABUELO",
        emoji: "👴",
        descripcion: "Aprende la seña correspondiente a abuelo.",
        video: "../videos/familia/abuelo.mp4"
    },

    {
        nombre: "ABUELA",
        emoji: "👵",
        descripcion: "Aprende la seña correspondiente a abuela.",
        video: "../videos/familia/abuela.mp4"
    },

    {
        nombre: "FAMILIA",
        emoji: "👨‍👩‍👧‍👦",
        descripcion: "Aprende la seña correspondiente a familia.",
        video: "../videos/familia/familia.mp4"
    },

    {
        nombre: "HERMANO",
        emoji: "👦",
        descripcion: "Aprende la seña correspondiente a hermano.",
        video: "../videos/familia/hermano.mp4"
    },

    {
        nombre: "HERMANA",
        emoji: "👧",
        descripcion: "Aprende la seña correspondiente a hermana.",
        video: "../videos/familia/hermana.mp4"
    },

    {
        nombre: "ESPOSO / ESPOSA",
        emoji: "❤️",
        descripcion: "Aprende las señas correspondientes a esposo y esposa.",
        video: "../videos/familia/esposo.mp4",
        videoAlternativo: "../videos/familia/esposa.mp4"
    }

];


// ==========================================
// USUARIO ACTIVO
// ==========================================

function obtenerUsuarioActivo() {

    try {

        const datos =
            localStorage.getItem("usuarioSignbridge");

        if (!datos) {
            return null;
        }

        return JSON.parse(datos);

    } catch (error) {

        console.error(
            "Error al obtener usuario activo:",
            error
        );

        return null;
    }
}


// ==========================================
// GUARDAR USUARIO ACTIVO
// ==========================================

function guardarUsuarioActivo(usuario) {

    localStorage.setItem(
        "usuarioSignbridge",
        JSON.stringify(usuario)
    );


    const usuarios =
        JSON.parse(
            localStorage.getItem("usuariosSignbridge")
        ) || [];


    const posicion =
        usuarios.findIndex(
            user =>
                String(user.id) ===
                String(usuario.id)
        );


    if (posicion !== -1) {

        usuarios[posicion] = usuario;

        localStorage.setItem(
            "usuariosSignbridge",
            JSON.stringify(usuarios)
        );
    }
}


// ==========================================
// RECUPERAR ÚLTIMA LECCIÓN
// ==========================================

function recuperarLeccionFamilia() {

    const usuario =
        obtenerUsuarioActivo();


    if (!usuario) {
        return 0;
    }


    if (!usuario.progreso) {
        return 0;
    }


    const leccionGuardada =
        Number(
            usuario.progreso.familiaLeccion
        );


    if (
        Number.isInteger(leccionGuardada) &&
        leccionGuardada >= 0 &&
        leccionGuardada < lecciones.length
    ) {

        return leccionGuardada;
    }


    return 0;
}


// ==========================================
// VARIABLE DE LECCIÓN ACTUAL
// ==========================================

let leccionActual =
    recuperarLeccionFamilia();


// ==========================================
// GUARDAR PROGRESO
// ==========================================

function guardarProgresoFamilia(porcentaje) {

    const usuario =
        obtenerUsuarioActivo();


    if (!usuario) {

        console.warn(
            "No hay usuario activo."
        );

        return;
    }


    if (!usuario.progreso) {

        usuario.progreso = {};
    }


    if (
        usuario.progreso.familia === undefined
    ) {

        usuario.progreso.familia = 0;
    }


    if (
        usuario.progreso.familiaLeccion === undefined
    ) {

        usuario.progreso.familiaLeccion = 0;
    }


    // Nunca reducir el progreso
    usuario.progreso.familia =
        Math.max(
            Number(
                usuario.progreso.familia
            ) || 0,
            porcentaje
        );


    usuario.progreso.familiaLeccion =
        leccionActual;


    guardarUsuarioActivo(usuario);
}


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const numeroLeccion =
    document.getElementById("numeroLeccion");

const tituloFamilia =
    document.getElementById("tituloFamilia");

const descripcion =
    document.getElementById("descripcion");

const nombreFamilia =
    document.getElementById("nombreFamilia");

const familyPreview =
    document.getElementById("familyPreview");

const instruccion =
    document.getElementById("instruccion");

const progresoTexto =
    document.getElementById("progresoTexto");

const barra =
    document.getElementById("barra");

const anterior =
    document.getElementById("anterior");

const siguiente =
    document.getElementById("siguiente");

const finalScreen =
    document.getElementById("finalScreen");

const volver =
    document.getElementById("volver");

const volverCursos =
    document.getElementById("volverCursos");

const videoLeccion =
    document.getElementById("videoLeccion");

const videoStatus =
    document.getElementById("videoStatus");


// ==========================================
// CARGAR VIDEO
// ==========================================

function cargarVideoLeccion() {

    const leccion =
        lecciones[leccionActual];


    if (!videoLeccion || !leccion) {
        return;
    }


    // Detener video anterior
    videoLeccion.pause();


    // Quitar video anterior
    videoLeccion.removeAttribute("src");


    // Limpiar reproductor
    videoLeccion.load();


    // Mostrar mensaje inicial
    videoStatus.textContent =
        "Cargando video...";


    // Asignar directamente el archivo
    videoLeccion.src =
        leccion.video;


    // Volver a cargar
    videoLeccion.load();

}


// ==========================================
// VIDEO CARGADO
// ==========================================

if (videoLeccion) {

    videoLeccion.addEventListener(
        "loadedmetadata",
        function () {

            videoStatus.textContent =
                "Video listo. Observa atentamente la seña y practícala.";

            console.log(
                "Video cargado correctamente:",
                lecciones[leccionActual].video
            );
        }
    );


    videoLeccion.addEventListener(
        "canplay",
        function () {

            videoStatus.textContent =
                "Observa atentamente la seña y repítela antes de continuar.";

        }
    );


    videoLeccion.addEventListener(
        "error",
        function () {

            videoStatus.textContent =
                "No se pudo cargar este video. Comprueba que el archivo exista y sea un MP4 válido.";

            console.error(
                "Error cargando video:",
                lecciones[leccionActual].video
            );

            if (videoLeccion.error) {

                console.error(
                    "Código de error:",
                    videoLeccion.error.code
                );
            }

        }
    );

}


// ==========================================
// MOSTRAR LECCIÓN
// ==========================================

function mostrarLeccion() {

    const leccion =
        lecciones[leccionActual];


    if (!leccion) {
        return;
    }


    // Número
    numeroLeccion.textContent =
        leccionActual + 1;


    // Título
    tituloFamilia.textContent =
        leccion.nombre;


    // Descripción
    descripcion.textContent =
        leccion.descripcion;


    // Nombre
    nombreFamilia.textContent =
        leccion.nombre;


    // Emoji
    familyPreview.textContent =
        leccion.emoji;


    // Instrucción
    instruccion.textContent =
        "Observa atentamente el video y practica la seña mostrada.";


    // Video
    cargarVideoLeccion();


    // Progreso
    const porcentaje =
        Math.round(
            (
                (leccionActual + 1) /
                lecciones.length
            ) * 100
        );


    progresoTexto.textContent =
        porcentaje + "%";


    barra.style.width =
        porcentaje + "%";


    // Accesibilidad
    const progressBar =
        document.querySelector(".progress-bar");


    if (progressBar) {

        progressBar.setAttribute(
            "aria-valuenow",
            porcentaje
        );
    }


    // Guardar
    guardarProgresoFamilia(
        porcentaje
    );


    // Botón anterior
    anterior.disabled =
        leccionActual === 0;


    // Botón siguiente
    if (
        leccionActual ===
        lecciones.length - 1
    ) {

        siguiente.textContent =
            "Finalizar curso ✓";

    } else {

        siguiente.textContent =
            "Siguiente →";
    }


    // Mostrar navegación
    anterior.style.display = "";
    siguiente.style.display = "";


    // Ocultar pantalla final
    finalScreen.classList.add(
        "hidden"
    );
}


// ==========================================
// SIGUIENTE
// ==========================================

siguiente.addEventListener(
    "click",
    function () {

        if (
            leccionActual <
            lecciones.length - 1
        ) {

            leccionActual++;


            mostrarLeccion();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        } else {

            finalizarCurso();
        }

    }
);


// ==========================================
// ANTERIOR
// ==========================================

anterior.addEventListener(
    "click",
    function () {

        if (
            leccionActual > 0
        ) {

            leccionActual--;


            mostrarLeccion();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });
        }

    }
);


// ==========================================
// FINALIZAR CURSO
// ==========================================

function finalizarCurso() {

    const usuario =
        obtenerUsuarioActivo();


    if (usuario) {

        if (!usuario.progreso) {

            usuario.progreso = {};
        }


        usuario.progreso.familia =
            100;


        usuario.progreso.familiaLeccion =
            lecciones.length - 1;


        guardarUsuarioActivo(
            usuario
        );
    }


    if (videoLeccion) {

        videoLeccion.pause();

        videoLeccion.removeAttribute(
            "src"
        );

        videoLeccion.load();
    }


    finalScreen.classList.remove(
        "hidden"
    );


    anterior.style.display =
        "none";


    siguiente.style.display =
        "none";


    finalScreen.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });
}


// ==========================================
// VOLVER A CURSOS
// ==========================================

volver.addEventListener(
    "click",
    function () {

        window.location.href =
            "cursos.html";

    }
);


// ==========================================
// VOLVER A FAMILIA
// ==========================================

volverCursos.addEventListener(
    "click",
    function () {

        window.location.href =
            "familia-cursos.html";

    }
);


// ==========================================
// INICIAR
// ==========================================

mostrarLeccion();