/* =========================================
   SIGNBRIDGE
   DATOS PERSONALES
========================================= */

const lecciones = [

    {
        titulo: "MI NOMBRE",
        descripcion:
            "Aprende cómo expresar tu nombre.",
        icono: "👤",
        texto:
            "Observa el material visual, identifica la expresión y practica la seña."
    },

    {
        titulo: "MI APELLIDO",
        descripcion:
            "Aprende cómo expresar tu apellido.",
        icono: "🪪",
        texto:
            "Observa el material visual y practica la expresión."
    },

    {
        titulo: "MI EDAD",
        descripcion:
            "Aprende cómo expresar tu edad.",
        icono: "🎂",
        texto:
            "Observa el material visual y practica la expresión."
    },

    {
        titulo: "¿CUÁNTOS AÑOS TIENES?",
        descripcion:
            "Aprende cómo preguntar la edad de otra persona.",
        icono: "❓",
        texto:
            "Observa el material visual y practica la pregunta."
    },

    {
        titulo: "¿DÓNDE VIVES?",
        descripcion:
            "Aprende cómo preguntar dónde vive otra persona.",
        icono: "🏠",
        texto:
            "Observa el material visual y practica la expresión."
    },

    {
        titulo: "VIVO EN...",
        descripcion:
            "Aprende cómo expresar dónde vives.",
        icono: "📍",
        texto:
            "Practica la expresión utilizando tu lugar de residencia."
    },

    {
        titulo: "SOY ESTUDIANTE",
        descripcion:
            "Aprende cómo expresar que eres estudiante.",
        icono: "🎓",
        texto:
            "Observa el material visual y practica la expresión."
    },

    {
        titulo: "MI ESCUELA",
        descripcion:
            "Aprende cómo hablar de tu escuela.",
        icono: "🏫",
        texto:
            "Observa el material visual y practica la expresión."
    },

    {
        titulo: "MI PAÍS",
        descripcion:
            "Aprende cómo expresar tu país.",
        icono: "🌎",
        texto:
            "Practica la expresión utilizando tu propio país."
    },

    {
        titulo: "MI FAMILIA",
        descripcion:
            "Aprende cómo expresar información básica sobre tu familia.",
        icono: "👨‍👩‍👧‍👦",
        texto:
            "Observa el material visual y practica la expresión."
    }

];


let leccionActual =
    recuperarLeccion();


/* =========================================
   USUARIO
========================================= */

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
                usuarioRegistrado =>
                    String(usuarioRegistrado.id) ===
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


/* =========================================
   RECUPERAR LECCIÓN
========================================= */

function recuperarLeccion() {

    const usuario =
        obtenerUsuarioActivo();


    if (
        usuario &&
        usuario.progreso &&
        typeof usuario.progreso.datosPersonalesLeccion ===
            "number"
    ) {

        return Math.min(
            Math.max(
                usuario.progreso.datosPersonalesLeccion,
                0
            ),
            lecciones.length - 1
        );
    }


    return 0;
}


/* =========================================
   GUARDAR PROGRESO
========================================= */

function guardarProgreso() {

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
            ((leccionActual + 1) /
                lecciones.length) *
            100
        );


    const progresoAnterior =
        Number(
            usuario.progreso.datosPersonales
        ) || 0;


    usuario.progreso.datosPersonales =
        Math.max(
            progresoAnterior,
            porcentaje
        );


    usuario.progreso.datosPersonalesLeccion =
        leccionActual;


    guardarUsuarioActivo(usuario);
}


/* =========================================
   ELEMENTOS
========================================= */

const titulo =
    document.getElementById("tituloLeccion");

const descripcion =
    document.getElementById("descripcionLeccion");

const nombre =
    document.getElementById("nombreLeccion");

const texto =
    document.getElementById("textoLeccion");

const icono =
    document.getElementById("iconoLeccion");

const contador =
    document.getElementById("numeroLeccion");

const progresoTexto =
    document.getElementById("progresoTexto");

const barra =
    document.getElementById("barra");

const navigationText =
    document.getElementById("navigationText");

const anterior =
    document.getElementById("anterior");

const siguiente =
    document.getElementById("siguiente");

const learningCard =
    document.querySelector(".learning-card");


/* =========================================
   MOSTRAR LECCIÓN
========================================= */

function mostrarLeccion(animar = false) {

    const leccion =
        lecciones[leccionActual];


    function actualizarContenido() {

        contador.textContent =
            leccionActual + 1;


        titulo.textContent =
            leccion.titulo;


        descripcion.textContent =
            leccion.descripcion;


        nombre.textContent =
            leccion.titulo;


        texto.textContent =
            leccion.texto;


        icono.textContent =
            leccion.icono;


        navigationText.textContent =
            `${leccionActual + 1} / ${lecciones.length}`;


        const porcentaje =
            Math.round(
                ((leccionActual + 1) /
                    lecciones.length) *
                100
            );


        progresoTexto.textContent =
            `${porcentaje}%`;


        barra.style.width =
            `${porcentaje}%`;


        anterior.disabled =
            leccionActual === 0;


        siguiente.innerHTML =
            leccionActual ===
            lecciones.length - 1
                ? "Finalizar ✓"
                : 'Siguiente <span>→</span>';


        guardarProgreso();
    }


    if (!animar) {

        actualizarContenido();

        return;
    }


    learningCard.classList.add(
        "changing"
    );


    setTimeout(() => {

        actualizarContenido();

        learningCard.classList.remove(
            "changing"
        );

    }, 220);
}


/* =========================================
   SIGUIENTE
========================================= */

function siguienteLeccion() {

    if (
        leccionActual <
        lecciones.length - 1
    ) {

        leccionActual++;

        mostrarLeccion(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } else {

        finalizarCurso();
    }
}


/* =========================================
   ANTERIOR
========================================= */

function anteriorLeccion() {

    if (
        leccionActual > 0
    ) {

        leccionActual--;

        mostrarLeccion(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


/* =========================================
   FINALIZAR
========================================= */

function finalizarCurso() {

    const usuario =
        obtenerUsuarioActivo();


    if (usuario) {

        if (!usuario.progreso) {
            usuario.progreso = {};
        }


        usuario.progreso.datosPersonales =
            100;


        usuario.progreso.datosPersonalesLeccion =
            lecciones.length - 1;


        guardarUsuarioActivo(usuario);
    }


    learningCard.style.display =
        "none";


    document.querySelector(
        ".progress-card"
    ).style.display =
        "none";


    document.querySelector(
        ".navigation"
    ).style.display =
        "none";


    document.querySelector(
        ".lesson-heading"
    ).style.display =
        "none";


    document.getElementById(
        "finalScreen"
    ).classList.remove(
        "hidden"
    );
}


/* =========================================
   VOLVER
========================================= */

document.getElementById(
    "volver"
).addEventListener(
    "click",
    () => {

        window.location.href =
            "presentaciones-cursos.html";
    }
);


document.getElementById(
    "volverCursos"
).addEventListener(
    "click",
    () => {

        window.location.href =
            "presentaciones-cursos.html";
    }
);


/* =========================================
   NAVEGACIÓN
========================================= */

siguiente.addEventListener(
    "click",
    siguienteLeccion
);


anterior.addEventListener(
    "click",
    anteriorLeccion
);


/* =========================================
   TRANSICIÓN
========================================= */

const transitionStyle =
    document.createElement("style");

transitionStyle.textContent = `

    .learning-card.changing {

        opacity: 0;

        transform:
            translateY(8px)
            scale(0.995);

        transition:
            opacity 0.22s ease,
            transform 0.22s ease;
    }

`;

document.head.appendChild(
    transitionStyle
);


/* =========================================
   INICIO
========================================= */

mostrarLeccion();